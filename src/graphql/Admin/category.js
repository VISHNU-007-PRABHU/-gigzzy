import gql from "graphql-tag";

export const ADD_CATEGORY = gql`
    mutation ADDCATEGORY($category_name: String,$description: String,$file:Upload,$base_price: String,$hour_price: String,$hour_limit: String,$day_price: String,$day_limit: String,$service_fee: String,$price_type:String,$certificates: [ID],$is_parent:Boolean) {
        addCategory(category_name:$category_name,description:$description,file: $file,base_price: $base_price,hour_price: $hour_price,hour_limit: $hour_limit,day_price:$day_price,day_limit:$day_limit,price_type:$price_type,service_fee: $service_fee,certificates: $certificates,is_parent:$is_parent){
            category_name
            _id
            description
            url
            uid
            info
        }
    }
`;

export const UPDATE_CATEGORY = gql`
    mutation update_Category($_id:ID,$is_block:Boolean,$is_future:Boolean,$category_name:String,$file:Upload,$description:String,$base_price: String,$hour_price: String,$hour_limit: String,$day_price: String,$day_limit: String,$service_fee: String,$price_type:String,$is_parent: Boolean,$certificates: [ID]){
        updateCategory(_id:$_id,is_block:$is_block,is_future:$is_future,category_name:$category_name,file:$file,description:$description,base_price: $base_price,hour_price: $hour_price,hour_limit: $hour_limit,day_price:$day_price,day_limit:$day_limit,price_type:$price_type,service_fee: $service_fee,certificates: $certificates,is_parent:$is_parent){
            info
        }
    }
`;


export const CHNAGE_PARENT_BLOCK = gql`
    mutation changeparentbolck($_id:ID,$is_block:Boolean){
        change_parent_bolck(_id:$_id,is_block:$is_block){
            info
        }
    }
`;

export const GET_CATEGORY = gql`
 query GETCATEGORY($limit: Int,$page:Int,$data:JSON) {
    get_category(limit:$limit,page:$page,data:$data) {
        pageInfo{
            totalDocs
            page
        }
        data{
            _id
            is_future
            is_block
            category_name
            description
            is_parent
            img_url
        }
    }
}
`;



export const FIND_CATEGORY = gql`
query FINDCATEGORY($_id:ID) {
    category(_id:$_id) {
        _id
        category_name
        description
        img_url
        certificates
        is_parent
        base_price
        hour_price
        hour_limit
        day_price
        day_limit
        price_type
        service_fee
        img_url
        Certificate{
            certificate_name
            _id
        }
    }
}
`;

export const DELETE_CATEGORY = gql`
    mutation DELETECATEGORY($_id:ID){
        deleteCategory(_id:$_id) {
            msg
            status
        }
    }
`;
