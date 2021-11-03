const { gql,SchemaDirectiveVisitor } = require('apollo-server');
const { defaultFieldResolver } = require('graphql');

const typeDefs = gql `
    scalar Date
    scalar JSON
    scalar Cursor

    directive @ref on FIELD_DEFINITION
    directive @payment(defaultFormat: String = "false") on FIELD_DEFINITION
    directive @currency(defaultFormat: String = "KES") on FIELD_DEFINITION
    directive @upper on FIELD_DEFINITION
    directive @date(format: String) on FIELD_DEFINITION
    directive @imgSize(format: String) on FIELD_DEFINITION

    type Subscription {
        messageSent(limit: Int,page:Int,user_id:ID,provider_id:ID,booking_id:ID):Chat
        get_my_appointments(_id:ID,role:Int,booking_status:Int,limit:Int,page:Int):[Booking]
        acceptedMessage(id:ID,online:Int): Booking   
        send_jobs_provider(_id:ID,online:Int): Booking
        send_accept_msg(_id:ID,booking_id:ID,online:Int): Booking
        booking_details(booking_id:ID,online:Int): Booking
        test(online:String):User
        proof_status(_id:ID,role:Int,):Detail
        demo_account(_id:ID):Detail
    }
    type Query {
        testmail:Detail
        user(_id:ID): [Detail]
        user_search(data:JSON):[Detail]
        check_demo_app(_id:ID):Detail
        category(_id:ID,is_parent:Boolean,category_type:Int):[Category] 
        sub_category(category_id:ID,_id:ID):[subCategory]
        status(user_id:ID):[Status]
        details(_id:ID):[Detail]
        certificate(_id:ID):[Certificate]
        static(_id:ID,page_code:String):[Static]
        user_address(user_id:ID):[UserAddress]
        search_category_only(data:JSON):[Category]
        search_sub_category_only(data:JSON):[subCategory]
        
        # find_provider(_id:ID,category_id:ID,online:String):Detail
        checkOtp(_id:ID,otp:String):Detail
        email_checkOtp(_id:ID,email_otp:String):Detail
        sign_up(role:Int,email:String,password:String,device_id:String):Detail
        files: [String]
        resend_otp(_id:ID):Detail
        test:Category
        get_my_appointments(_id:ID,role:Int,booking_status:Int,limit:Int,page:Int):BookingConnection
        booking(_id:ID):[Booking]
        get_now_job(_id:ID,role:Int,booking_status:Int):[Booking]
        get_message(booking_id:ID,user_id:ID,provider_id:ID):[Chat]
        search_category(_id:ID,data:JSON):[Category] 
        search_category_mobile(data:String):[Category]
        get_trending(_id:ID):[Category]
        get_is_future(_id:ID):[Category]
        get_extra_fare(booking_id:ID,option:Int):[Booking]
        get_payout_detail(data:JSON):[Booking]
        site_setting_detail(_id:ID):Site
        payout_setting_detail(_id:ID):Payout
        confirm_email(email:String,role:Int):Detail
        
        # pagination ...
        get_category(limit: Int,page:Int,is_parent:Boolean,data:JSON):CategoryConnection
        get_subcategory(limit: Int,page:Int,data:JSON):SubCategoryConnection
        get_user(limit: Int,page:Int,role:String,proof_status:Int):UserConnection
        get_certificate(limit: Int,page:Int):CertificateConnection
        get_static(limit: Int,page:Int):StaticConnection
        get_review(limit: Int,page:Int,user_comments_status:Int,option:String,data:JSON):BookingConnection
        get_booking(limit: Int,page:Int,booking_status:[Int],payment_status:[Int],provider_id:ID,user_id:ID,category_id:ID,booking_date:JSON,booking_ref:JSON):BookingConnection 
        get_booking_details(limit: Int,page:Int,status:Int,_id:ID):BookingConnection 
        get_payout(limit: Int,page:Int,provider_id:ID,booking_id:ID,booking_status:Int,option:Int):BookingConnection
        get_all_payout(limit: Int,page:Int,provider_id:ID,booking_id:ID,booking_status:Int,option:Int):BookingConnection
        get_booking_chart(option:Int):[Dashboard]
        get_cancel_chart(option:Int):[Dashboard]
        get_earnings_chart(option:Int):[Dashboard]
        get_others_chart(option:Int):[Dashboard]
    }

    # sub category pagination data
    type SubCategoryConnection {
        data: [subCategory]
        pageInfo: PageInfo!
    }

    # category pagination data
    type CategoryConnection {
        data:[Category]
        pageInfo: PageInfo!
    }

     # user pagination data
     type UserConnection {
        data:[Detail]
        pageInfo: PageInfo!
    }


     # certificate pagination data
     type CertificateConnection {
        data:[Certificate]
        pageInfo: PageInfo!
    }

     # static pagination data
     type StaticConnection {
        data:[Static]
        pageInfo: PageInfo!
    }
    # Booking pagination data
    type BookingConnection {
        data:[Booking]
        pageInfo: PageInfo!
    }
    # Booking pagination data
    type PayoutConnection {
            data:[Booking]
            pageInfo: PageInfo!
        }
    # pagination data 
    type PageInfo {
        totalDocs: Int
        page: Int
        total_amount:String
    }

    type Site{
        site_name: String
        site_email:String
        img_logo:String
        copyrights_content: String
        playstore_link: String
        appstore_link:String
        contact_number: String
        contact_email:String
        site_currency:String
        created_at: String
        update_at:String
        img_icon:String
        site_icon:String
        site_logo:String
        msg:String
        status:String
    }
    type Dashboard{
        msg:String
        status:String
        total:Float 
        earning:Float  @currency
        revenue:Float  @currency
        user:Int
        provider:Int
        _id:Int
        count:Int
        created_at:String
        id:ID
        option:Int
    }
    type User{
        id:ID
        role:Int
        demo:Boolean
        country_code:String
        phone_no:String
        otp:String
        email_otp:String
        message:String
        createdAt: Date
        updatedAt: Date
        detail(user_id:ID):[Detail]
        account:[Account]
        device_id:String
        category(_id:ID):[Category]
        sub_category(category_id:ID,_id:ID):[subCategory]
        status:[Status]
        booked:[Booking]
        info:JSON
        docs:[JSON]
        totalDocs: Int
        limit: Int
        hasPrevPage:Boolean
        hasNextPage: Boolean
        page: Int
        totalPages: Int
        pagingCounter: Int
        prevPage: String
        nextPage: String
    }
    type Chat{
        id:ID
        message:String
        role:Int
        createdAt: Date
        msg_date:String @date(format: "DD MMMM YYYY")
        msg_time:String @date(format: "hh:mm a")
        updatedAt: Date
        user(_id:ID):[Detail]
        provider(_id:ID):[Detail]
        booked(_id:ID):[Booking]
        info:JSON
        docs:[JSON]
        totalDocs: Int
        limit: Int
        hasPrevPage:Boolean
        hasNextPage: Boolean
        page: Int
        totalPages: Int
        pagingCounter: Int
        prevPage: String
        nextPage: String
    }
    type Admin{
        username:String
        email:String
        password:String
        info:JSON
    }
    type Certificate{
        id: ID
        _id:ID
        certificate_name:String
        description:String
        info:JSON
        docs:[JSON]
        totalDocs: Int
        limit: Int
        hasPrevPage:Boolean
        hasNextPage: Boolean
        page: Int
        totalPages: Int
        msg:String
        status:String
        pagingCounter: Int
        prevPage: String
        nextPage: String 
    }
    type Static{
        id: ID
        _id:ID
        page_name:String
        page_code:String
        description:String
        title:String
        msg:String
        status:String
        info:JSON
        docs:[JSON]
        totalDocs: Int
        limit: Int
        hasPrevPage:Boolean
        hasNextPage: Boolean
        page: Int
        totalPages: Int
        pagingCounter: Int
        prevPage: String
        nextPage: String 
    }
    type Payout{
        id: ID
        _id:ID
        user_name:String,
        password:String,
        secret_key:String,
        client_key:String,
        signature:String
        payout_status:String
        provider_id:ID
        booking_id:ID
        amount:String
        total_amount:String @currency
        status:String
        info:JSON
        totalDocs: Int
        page: Int
        data:JSON
        msg:String
    }
    type Detail{
        _id: ID
        role:Int
        demo:Boolean
        email:String
        password:String
        name:String
        address:String
        country_code:String
        bank_name:String
        ifsc_code:String
        kra_pin:String
        branch_name:String
        routing_name:String
        payout_option:String
        payout_phone:String
        payout_frist_name:String
        payout_second_name:String
        payout_id:String
        account_no:String
        account_name:String
        phone_no:String
        phone_number:String
        location:JSON
        img_url:String
        lat:Float
        lng:Float
        rating:String
        comments:String
        email_otp:String
        profile:String
        device_id:String
        booking_status:Int
        kilometre:Float
        availability:[JSON]
        mon_availability:[Int],
        tues_availability:[Int],
        wed_availability:[Int],
        thus_availability:[Int],
        fri_availability:[Int],
        sat_availability:[Int],
        sun_availability:[Int],
        otp:String,
        status:String,
        booked:[JSON]
        provider_subCategoryID:[ID]
        Upload_percentage:Int
        proof_status:Int
        professional_document:[String]
        personal_document:[String]
        personal_document_url:[String]
        professional_document_url:[String]
        online:String
        hours:String
        description:String
        category(_id:ID):[Category]
        sub_category(category_id:ID,_id:ID):[subCategory]
        booking:[Booking]
        provider_rating(id:ID):[Detail]
        provider_rate:[Detail]
        msg:String
        pending_status:Int   
        ok:Int
        n: Int
        info:JSON
        nModified: Int
        image:String
        docs:[JSON]
        totalDocs: Int
        limit: Int
        hasPrevPage:Boolean
        hasNextPage: Boolean
        page: Int
        totalPages: Int
        pagingCounter: Int
        prevPage: String
        nextPage: String
    }
    
    type Account{
        id:ID
        email:String
        password:String
        phone_no:String
    }


    type Category{
        id: ID
        _id:ID
        uid:ID
        is_future:Boolean
        category_type:Int
        category_name:String @upper
        Certificate:[Certificate]
        certificates:[ID]
        subCategory_name:String  @upper
        base_price:String  @currency
        hour_price:String  @currency
        hour_limit:String
        day_price:String  @currency
        day_limit:String
        price_type:String
        service_fee:String
        description:String
        img_url:String 
        small_img_url:String @imgSize(format:"small")
        url:String
        is_parent:Boolean
        sub_category(category_id:ID,_id:ID):[subCategory]
        child_category:[subCategory]
        booking_parent_category(category_id:ID,_id:ID):[Category]
        msg:String
        status:String
        is_block:Boolean
        ok:Int
        data:JSON
        info:JSON
        docs:[JSON]
        child:[JSON]
        totalDocs: Int,
        limit: Int,
        hasPrevPage:Boolean,
        hasNextPage: Boolean,
        page: Int,
        totalPages: Int,
        pagingCounter: Int,
        prevPage: String,
        nextPage: String 
    }
    type subCategory{
        id:ID
        _id:ID
        uid:ID
        is_future:Boolean
        is_block:Boolean
        category_type:Int
        url:String
        category(category_id:ID,_id:ID):[Category]
        Certificate:[Certificate]
        category_id:String
        categoryid:JSON
        certificates:[ID]
        subCategory_name:String  @upper
        base_price:String  @currency
        hour_price:String  @currency
        hour_limit:String
        day_price:String  @currency
        day_limit:String
        price_type:String
        img_url:String
        small_img_url:String @imgSize(format:"small")
        service_fee:String 
        description:String
        created_at:String
        update_at:String
        marker:String
        ok:String
        msg:String
        status:String
        data:[JSON]
        pageInfo:JSON
        info:JSON
        docs:[JSON]
        totalDocs: Int
        limit: Int,
        hasPrevPage:Boolean,
        hasNextPage: Boolean,
        page: Int,
        totalPages: Int,
        pagingCounter: Int,
        prevPage: String,
        nextPage: String 
    }
    
    type Status{
        user_id: ID
        availability:String
        phone_verification:String
        email_verification:String
        lastOtp_verification:String
        lastEmail_verification:String
        lastEmailOtp_verification:String
    }
    type Info{
        msg:String,
        status:String,
    }
    type Booking{
        id:ID
        _id:ID,
        user_id: ID
        provider_id:ID
        category_id:ID
        booking_ref:String @ref
        ctob:Boolean @payment
        ctob_shotcode:String
        ctob_billRef:String
        data:[JSON],
        booking_date:String @date(format: "DD/MM/YYYY hh:mm a")
        booking_time:String
        booked:String
        status:String
        hours:String
        base_price:String @currency
        hour_price:String @currency
        extra_price:String @currency
        created_date:String
        bookingDate:String
        job_start_time:String @date(format: "DD/MM/YYYY hh:mm a")
        job_end_time:String @date(format: "DD/MM/YYYY hh:mm a")
        hour_limit:String
        stripe_token:String
        service_fee:String
        user_image:[String]
        user_image_url:[String]
        user_rating_status:Int
        provider_rating_status:Int
        extra_fare_id:ID
        booking_status:Int
        booking_type:Int
        kilometre:Float
        lat:Float
        lng:Float
        phone_number:String
        provider_msg_count:Int
        user_msg_count:Int
        provider_msg_is_read:Int
        user_msg_is_read:Int
        created_at:String @date(format: "DD/MM/YYYY hh:mm a")
        amount:String  @currency
        extra_fare:String  @currency
        start_job_image:[String]
        accept_date:String @date(format: "DD/MM/YYYY hh:mm a")
        end_date:Date
        actual_time:String
        end_job_image:[String]
        start_job_image_url:[String]
        user_comments_status:Int
        end_job_image_url:[String]
        charge_id:String
        payment_message:String
        MpesaReceiptNumber:String
        payment_type:String
        job_status:Int
        jobStart_time:Date
        jobEnd_time:Date
        location:JSON
        extra_fare_reason:String
        total:String @currency
        booking_alert:Int
        user_rating:Int
        provider_rating:Int
        provider_comments:String
        user_comments:String
        provider_fee:String  @currency
        admin_fee:Int  @currency
        payment_status:Int
        final_payment:String  @currency
        extra_hour_price:String  @currency
        category_type:String
        description: String
        availability:[JSON] 
        total_amount:String  @currency
        find_kilometre(lat:Float,lng:Float):Detail
        category(_id:ID,category_type:Int):[Category]
        booking_category(_id:ID,category_type:Int):[Category]
        user(_id:ID):[Detail]
        booking_user(_id:ID):[Detail]
        booking_provider(_id:ID):[Detail]
        provider(_id:ID):[Detail]
        find_payout_provider:[Detail]
        get_my_appointments(_id:ID,booking_status:Int):[Booking]
        send_job_category(_id:ID,type:Int):[Category]
        get_booking_on_status(_id:ID,booking_status:Int):[Booking]
        find_payout_booking:[Booking]
        get_booking_message(booking_id:ID):[Chat]
        mpeas_payment_callback:Boolean
        ok:Int
        msg:String
    }

    type File {
        filename: String!
        mimetype: String!
        filesize: Int!
    }

    type static{
        name:String
        description:String,
        title:String,
        content:String,
    }
    type UserAddress{
        option:Int  
        msg:String
        status:String
        is_default:Int
        delete:Int
        _id:ID
        user_id: String,
        title: String,
        flat_no: String,
        landmark: String,
        address: String,
        lat: String,
        lng: String,
        city: String,
        state: String,
        country: String,
        zip_code: String,
        distance:String,
    }


    type Mutation {
        adminLogin(email:String,password:String):Admin
        reset_password(email:String,password:String,role:Int,id:ID):Detail
        change_parent_bolck(_id:ID,is_block:Boolean):Category
        addStatus( user_id: ID,availability:String, proof_status:String,phone_verification:String, email_verification:String,last_verification:String,lastEmail_verification:String,):Status!
        addCategory(category_name:String,file:Upload,description:String,base_price:String,hour_price:String,day_price:String,hour_limit:String,day_limit:String,price_type:String,service_fee:String,is_parent:Boolean,certificates:[ID]): Category
        addsubCategory(file: Upload,category_id:ID,subCategory_name:String,base_price:String,hour_price:String,day_price:String,hour_limit:String,day_limit:String,price_type:String,service_fee:String,description:String,certificates:[ID]):subCategory
        addDetails(_id:ID,email:String,password:String,name:String,address:String,rating:Float,comments:String,lat:Float,lng:Float,profile:String,availability:String,Upload_percentage:String,device_id:String):Detail
        addUser(role:Int,_id:ID,option:String,country_code:String,phone_no:String,email:String,old_password:String,password:String,name:String,provider_subCategoryID:[ID],lat:Float,lng:Float,bank_name:String,payout_option:String,ifsc_code:String,account_no:String,branch_name:String,routing_name:String,account_name:String,device_id:String,kra_pin:String,payout_phone:String,payout_frist_name:String,payout_second_name:String,payout_id:String): Detail!
        addProvider_Category(user_id: ID,provider_subCategoryID:[ID]):Detail
        add_providerDocument(user_id:ID,file:[Upload],option:String):Detail
        delete_providerDocument(user_id:ID,filename:String,option:String):Detail
        updateCategory(_id:ID,is_block:Boolean,is_future:Boolean,category_name:String,file:Upload,description:String,base_price:String,day_price:String,hour_price:String,price_type:String,day_limit:String,hour_limit:String,service_fee:String,is_parent:Boolean,certificates:[ID]):Category
        update_profile(file:Upload,_id:ID):Detail
        updatesubCategory(_id:ID,is_block:Boolean,is_future:Boolean,file: Upload,_id:ID,category_id:ID,subCategory_name:String,base_price:String,day_price:String,hour_price:String,price_type:String,day_limit:String,hour_limit:String,service_fee:String,description:String,certificates:[ID]):subCategory
        updateAvailability(user_id: ID,weekday:JSON):Detail
        removeAvailability(user_id: ID,weekday:JSON):Detail
        change_proofStatus(user_id: ID,proof_status:String):Detail

        # --------------------- delete function ------------------------------------ #
        deleteDetails(_id:ID):Detail
        deleteStatic(_id:ID):Static
        deleteCertificate(_id:ID):Certificate
        deleteCategory(_id:ID,category_name:String):Category
        deletesubCategory(_id:ID,category_name:String,category_id:String,subCategory_name:String):subCategory
        deleteProvider_Category(user_id: ID,provider_subCategoryID:[ID]):Detail
        deleteBooking(_id:ID,user_id:ID):Booking
         # --------------------- delete function ------------------------------------ #

        remove_providerDocument(user_id:ID,document:[String]):Detail
        add_certificate(certificate_name:String):Certificate
        update_certificate(certificate_name:String,_id:ID):Certificate
        add_static(page_name:String,page_code:String,description:String,title:String):Static
        update_static(_id:ID,page_name:String,page_code:String,description:String,title:String):Static
        admin_add_user(role:Int,demo:Boolean,country_code:String,phone_no:String,email:String,password:String,name:String,provider_subCategoryID:[ID],lat:Float,lng:Float,address:String): User!
        admin_update_user(_id:ID,demo:Boolean,role:Int,country_code:String,phone_no:String,email:String,password:String,name:String,provider_subCategoryID:[ID],lat:Float,lng:Float,address:String): User!
        provider_document_verified(_id:ID,proof_status:String):Detail
        online_status(_id:ID,online_status:Int):Detail
        # booking process
        add_booking( user_id:ID,provider_id:ID,category_id:ID,lat:Float,lng:Float,weekday:JSON,hours:String,description:String,booking_status:Int,booking_type:Int,data:[JSON],file:[Upload],category_type:Int,booking_date:String,booking_time:String,booking_hour:String):[Booking]
        manage_booking(role:Int,booking_id:ID,user_id:ID,provider_id:ID,category_id:String,lat:Float,lng:Float,weekday:JSON,hours:String,description:String,booking_status:Int,category_type:Int,stripe_token:String,payment_type:String,phone_number:String,extra_fare:String,extra_fare_reason:String,option:Int,extra_fare_id:ID):[Booking]
        update_booking(provider_id:ID,booking_id:ID,file:[Upload],option:Int):Booking
        update_booking_details(provider_id:ID,booking_id:ID,file:[Upload],option:Int,user_comments_status:Int):Booking
        pay_admin_to_provider(booking_status:Int,status:Int,provider_id:ID):Booking
        # chat
        add_message(role:Int,booking_id:ID,user_id:ID,provider_id:ID,message:String):Chat
        available_deleteBooking(_id:ID):Booking
        addRating(comments:String,rating:Int,user_id:ID,provider_id:ID,booking_id:ID,role:Int):Booking
        update_msg_is_read(role:Int,booking_id:ID):Booking
        update_site_img(_id:ID,file:Upload,option:Int):Site
        update_manual_payment(role:Int,booking_id:ID):Booking
        add_site_detail(
            _id:ID,
            site_name: String,
            site_email: String,
            copyrights_content: String,
            playstore_link: String,
            appstore_link: String,
            contact_number: String,
            contact_email: String,
            site_currency: String,):Site
        add_payout_detail(
            _id:ID,
            user_name:String,
            password:String,
            secret_key:String,
            client_key:String,
            signature:String,
            payout_status:Int):Payout

        modified_address(
            option:Int  
            is_default:Int
            delete:Int
            _id:ID
            user_id: String,
            title: String,
            flat_no: String,
            landmark: String,
            address: String,
            lat: String,
            lng: String,
            city: String,
            state: String,
            country: String,
            zip_code: String,
            distance:String,
            ):UserAddress
        }
`;
module.exports.typeDefs = typeDefs;
module.exports.JSON = (data) => {
    __serialize(value)
    {
        return GraphQLJSON.parseValue(value);
    }
};

module.exports.Date = (value) => {
    if (isISO8601(value)) {
        return value;
    }
    throw new Error('DateTime cannot represent an invalid ISO-8601 Date string');
};

// module.exports = {
//     // The cursor type. Will obfuscate the MongoID.
//     Cursor: CursorType,
//     // Apply the pagination resolvers for the connection and edge.
//     ContactConnection: paginationResolvers.connection,
//     ContactEdge: paginationResolvers.edge,

//   };;