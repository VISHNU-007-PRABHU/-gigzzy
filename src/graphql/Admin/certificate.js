import gql from "graphql-tag";

export const ADD_CERTIFICATE = gql`
    mutation ADDCERTIFICATE($certificate_name: String) {
        add_certificate(certificate_name:$certificate_name){
            certificate_name
            _id
            info
        }
    }
`;

export const UPDATE_CERTIFICATE = gql`
    mutation update_CERTIFICATE($_id:ID,$certificate_name:String){
        update_certificate(_id:$_id,certificate_name:$certificate_name){
            info
        }
    }
`;

export const CERTIFICATE = gql`
 query CERTIFICATE {
    certificate {
        certificate_name
            _id
    }
}
`;

export const GET_CERTIFICATE = gql`
 query GETCERTIFICATE($limit: Int,$page:Int) {
    get_certificate(limit:$limit,page:$page) {
        pageInfo{
      totalDocs
    }
    data{
        certificate_name
            _id
    }
    }
}
`;


export const FIND_CERTIFICATE = gql`
query FINDCERTIFICATE($_id:ID) {
    certificate(_id:$_id) {
        _id
        certificate_name
        
    }
}
`;

export const DELETE_CERTIFICATE = gql`
    mutation DELETECERTIFICATE($_id: ID)  {
    deleteCertificate(_id:$_id){
        msg   
        status      
    }
}`
