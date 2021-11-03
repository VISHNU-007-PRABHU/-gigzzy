import gql from "graphql-tag";

export const GET_SUBCATEGORY = gql`
query GETSUBCATEGORY($limit: Int,$page:Int,$data:JSON) {
    get_subcategory(limit:$limit,page:$page,data:$data) {
        pageInfo{
      totalDocs
      page
    }
    data{
        _id
        subCategory_name
        base_price
        hour_price
        day_price
        day_limit
        price_type
        is_future
        is_block
        hour_limit
        service_fee
        description
        img_url
        small_img_url
        category{
            category_name
        }
        Certificate{
            certificate_name
            _id
        }
    }
    }
}
`;


export const CATEGORY_NAME = gql`
query CATEGORYNAME($is_parent:Boolean) {
    category(is_parent:$is_parent) {
        _id
       category_name
       Certificate{
            certificate_name
            _id
        }
    }
}
`;

export const SUBCATEGORY_NAME = gql`
{
    sub_category{
        _id
        subCategory_name
    }
}
`;

export const ADD_SUBCATEGORY = gql`
    mutation ADDSUBCATEGORY($file: Upload,$category_id: ID,$subCategory_name: String,$base_price: String,$hour_price: String,$hour_limit: String,$day_price: String,$day_limit: String,$price_type: String,$service_fee: String,$description: String,$certificates: [ID],) {   
        addsubCategory(file:$file,category_id: $category_id,subCategory_name: $subCategory_name,base_price: $base_price,hour_price: $hour_price,hour_limit: $hour_limit,day_price:$day_price,day_limit:$day_limit,price_type:$price_type,service_fee: $service_fee
        ,description: $description,certificates: $certificates,){
            info
        }
    }
`;

export const UPDATE_SUBCATEGORY = gql`
    mutation UPDATESUBCATEGORY($_id:ID,$is_block:Boolean,$is_future:Boolean,$file: Upload,$category_id: ID,$subCategory_name: String,$base_price: String,$hour_price: String,$day_price: String,$day_limit: String,$hour_limit: String,$service_fee: String,$description: String,$certificates: [ID],$price_type:String) {   
        updatesubCategory(_id:$_id,is_block:$is_block,is_future:$is_future,file:$file,category_id: $category_id,subCategory_name: $subCategory_name,base_price: $base_price,hour_price: $hour_price,hour_limit: $hour_limit,day_price:$day_price,day_limit:$day_limit,price_type:$price_type,service_fee: $service_fee
        ,description: $description,certificates: $certificates,){
            info
        }
    }
`;

export const FIND_SUBCATEGORY = gql`
query FINDSUBCATEGORY($_id:ID) {
    sub_category(_id:$_id) {
        certificates
        _id
        category_id
        subCategory_name
        base_price
        hour_price
        hour_limit
        day_price
        day_limit
        price_type
        service_fee
        description
        img_url
        Certificate{
            certificate_name
            _id
        }
    }
}
`;

export const DELETE_SUBCATEGORY = gql`
    mutation DELETESUBCATEGORY($_id:ID){
        deletesubCategory(_id:$_id) {
            msg
            status
        }
    }
`;
