const express = require('express')
const app = require('express')()
// const CronJob = require('cron').CronJob;
const util = require('util');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path');
const http = require('http');
const https = require('https');
const { ApolloServer, gql, SchemaDirectiveVisitor } = require('apollo-server-express');
const { defaultFieldResolver, GraphQLString } = require('graphql');
const { typeDefs } = require('./node/graphql/schema');
const { resolvers, confrimation_call, c2b_confirmation, c2b_validation } = require('./node/graphql/resolver');
const moment = require('moment');
const { createWriteStream, existsSync, mkdirSync } = require("fs");
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true, parameterLimit: 5000000 }));
app.use(express.json());
const getSymbolFromCurrency = require('currency-symbol-map')
const fs = require('fs');
const cwd = process.cwd();
const dotenv = require('dotenv');
const expressStaticGzip = require('express-static-gzip');
// const i18n = require("i18n");
dotenv.config();
// i18n.configure({
//   locales: ['en', 'es'],
//   directory: __dirname + '/locales'
// });
class refDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      const result = await resolve.apply(this, args);
      if (typeof result === "string") {
        return `#${result}`;
      }
      return result;
    };
  }
}
class ImgSizeDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const { format } = this.args;
    field.resolve = async function (...args) {
      const imgurl = await resolve.apply(this, args);
      if (imgurl) {
        if (format && format == "small") {
          return `${imgurl}_small.jpg`;
        } else {
          return imgurl
        }
      } else {
        return '';
      }
    };
    // The formatted Date becomes a String, so the field type must change:
    field.type = GraphQLString;
  }
}
class DateFormatDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const { format } = this.args;
    field.resolve = async function (...args) {
      const date = await resolve.apply(this, args);
      if (date) {
        return moment(date).tz('Asia/Kolkata').format(format);
      } else {
        return '';
      }
    };
    // The formatted Date becomes a String, so the field type must change:
    field.type = GraphQLString;
  }
}

class UpperCaseDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      const result = await resolve.apply(this, args);
      if (typeof result === "string") {
        return result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
      }
      return result;
    };
  }
}


class c2bDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      return true;
    };
  }
}

class currencyDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const { defaultFormat } = this.args;

    field.args.push({
      name: 'format',
      type: GraphQLString
    });

    field.resolve = async function (
      source,
      { format, ...otherArgs },
      context,
      info,
    ) {
      const date = await resolve.call(this, source, otherArgs, context, info);
      // If a format argument was not provided, default to the optional
      // defaultFormat argument taken by the @date directive:
      // console.log(`${getSymbolFromCurrency(format || defaultFormat)}${date}`);
      return `${getSymbolFromCurrency(format || defaultFormat)}${date}`;
    };

    field.type = GraphQLString;
  }
}
const server = new ApolloServer({
  cors: {
    origin: '*',			// <- allow request from all domains
    credentials: true
  },
  typeDefs,
  resolvers: [resolvers],
  schemaDirectives: {
    currency: currencyDirective,
    ref: refDirective,
    date: DateFormatDirective,
    upper: UpperCaseDirective,
    imgSize: ImgSizeDirective,
    payment: c2bDirective
  },
  subscriptions: {
    onConnect: () => { },
    // console.log('Connected to websocket'),
    onDisconnect: () => {
    },
    uploads: {
      maxFileSize: 10000000, // 10 MB
      maxFiles: 10
    },
  },
  context: async ({ req, connection }) => {
    if (connection) {
      // check connection for metadata
      return connection.context;
    } else {
      // check from req
      const token = req.headers.authorization || "";

      return { token };
    }
  },
});

server.applyMiddleware({ app });

const buildPath = path.join(__dirname, '..', 'build');
app.use(
  '/',
  expressStaticGzip('./build', {
    enableBrotli: true,
    orderPreference: ['br', 'gz']
  })
);

// app.use('/', express.static('./build'));

existsSync(path.join(__dirname, "./node/images")) || mkdirSync(path.join(__dirname, "./node/images"));
existsSync(path.join(__dirname, "./node/images/provider")) || mkdirSync(path.join(__dirname, "./node/images/provider"));
existsSync(path.join(__dirname, "./node/images/booking")) || mkdirSync(path.join(__dirname, "./node/images/booking"));
existsSync(path.join(__dirname, "./node/images/user")) || mkdirSync(path.join(__dirname, "./node/images/user"));
existsSync(path.join(__dirname, "./node/images/user/profile")) || mkdirSync(path.join(__dirname, "./node/images/user/profile"));
existsSync(path.join(__dirname, "./node/images/provider/document")) || mkdirSync(path.join(__dirname, "./node/images/provider/document"));
existsSync(path.join(__dirname, "./node/images/provider/profile")) || mkdirSync(path.join(__dirname, "./node/images/provider/profile"));
existsSync(path.join(__dirname, "./node/images/category")) || mkdirSync(path.join(__dirname, "./node/images/category"));
existsSync(path.join(__dirname, "./node/images/subcategory")) || mkdirSync(path.join(__dirname, "./node/images/subcategory"));

app.use("/images", express.static(path.join(__dirname, "./node/images")));
app.use("/document", express.static(path.join(__dirname, "./node/document")));
app.use('/static', express.static(__dirname + '/public'));


app.post('/confirmation', async (req, res, next) => {
  try {
    let confirm_data = await confrimation_call(req.body)
    // console.log("confirm_data", confirm_data)
    return res.send({ status: true, message: "we reviced confirmation" })
  } catch (error) {
    // console.log("confirmation error", error)
    return res.send(error)
  }
})

app.post('/refund_confirmation', async (req, res, next) => {
  try {
    console.log(req.body, "refund_confirmation confirmation")
    console.log(req.body['Result']['stkCallback'])
    // let confirm_data = await confrimation_call(req.body)
    // console.log("confirm_data", confirm_data)
    return res.send({ status: true, message: "we reviced confirmation" })
  } catch (error) {
    console.log("confirmation error", error)
    return res.send(error)
    return res.send({ status: true, message: "we reviced confirmation but error in code" })
  }
})

app.post('/c2b_validation', async (req, res, next) => {
  try {
    console.log(req.body, "ops validation")
    let confirm_data = await c2b_validation(req.body)
    console.log("confirm_data", confirm_data)
    return res.send({
      "ResultCode": 0,
      "ResultDesc": "Accepted"
    })
  } catch (error) {
    console.log("ops, not valid data",error)
    return res.send({
      "ResultCode": 1,
      "ResultDesc": "Rejected"
    })
  }
})

app.post('/c2b_confirmation', async (req, res, next) => {
  try {
    console.log(req.body, "ops c2b")
    let confirm_data = await c2b_confirmation(req.body)
    return res.send({ status: true, message: "we reviced cancelled" })
  } catch (error) {
    return res.send(error.message)
  }
})

app.use(async (req, res, next) => {
  const url = req.url;
  // console.log(url);
  const uriArray = url.split('/');
  if (uriArray[1] !== 'graphql' && uriArray[1] !== "c2b_confirmation" && uriArray[1] !== "c2b_validation" && uriArray[1] !== "confirmation" && uriArray[1] !== "validation" && uriArray[1] !== "cancelled") {
    // console.log("react run");
    const readFile = util.promisify(fs.readFile)
    try {

      var text = await readFile(cwd + '/build/index.html', 'utf8');

      return res.send(text);
    } catch (error) {
      return res.send(error.message)
    }
  }
  else if (uriArray[1] == 'node') {
    try {
      // console.log(cwd + url);
    } catch (error) {
      return res.send(error.message)
    }
  }
});

// use it before all route definitions
var cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000' }));



mongoose.connect('mongodb://localhost/gigzzy').then(() => {
}).catch((err) => {
  // console.log("Not Connected to Database ERROR! ", err);
});


// const httpHost = process.env.HTTP_HOST || 'localhost';
const PORT = 8990;



// const httpServer = https.createServer(
//   {
//     key:  fs.readFileSync(process.env.HTTPS_KEY),
//     cert:  fs.readFileSync(process.env.HTTPS_CERT)
//   },
//   app
// )
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
})

module.exports = app;