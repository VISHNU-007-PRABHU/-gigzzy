import gql from "graphql-tag";


export const GET_CATEGORY_PAGINATION = gql`
 query GETCATEGORYPAGINATION($limit: Int,$page:Int,$data:JSON){
    get_category(limit:$limit,page:$page,data:$data) {
        pageInfo{
            totalDocs
            page
        }
        data{
            _id
            category_type
            category_name
            is_parent
            small_img_url
            base_price
            child_category{
                _id
                subCategory_name
            }	
        }
    }
}
`;

export const GET_CATEGORY = gql`
 query GETCATEGORY{
    category{
        _id
        category_type
        category_name
        is_parent
        small_img_url
        base_price
        child_category{
            _id
            subCategory_name
        }	
    }
}
`;

export const SEARCH_CATEGORY = gql`
query SEARCH_CATEGORY($_id:ID,$data:JSON) {
    search_category(_id:$_id,data:$data) {
        _id
        category_name
        description
        small_img_url
        certificates
        is_parent
        base_price
        hour_price
        hour_limit
        service_fee
        img_url
        category_type
        subCategory_name
        Certificate{
            certificate_name
            _id
        }
    }
}
`;


export const SEARCH_CATEGORY_ONLY = gql`
query SEARCHCATEGORYONLY($data:JSON) {
    search_category_only(data:$data) {
        _id
        category_name
    }
}
`;


export const SEARCH_SUB_CATEGORY_ONLY = gql`
query SEARCHSUBCATEGORYONLY($data:JSON) {
    search_sub_category_only(data:$data) {
        _id
        subCategory_name
    }
}
`;

export const FIND_CATEGORY = gql`
query FINDCATEGORY($_id:ID,$category_type:Int) {
    category(_id:$_id,category_type:$category_type) {
        _id
        category_name
        small_img_url
        is_parent
        description
        child_category{
            _id
            subCategory_name
            description
            img_url
        }
    }
}
`;


export const FIND_SUBCATEGORY = gql`
query FINDSUBCATEGORY($_id:ID) {
    sub_category(_id:$_id) {
        _id
        subCategory_name
        img_url
        small_img_url
        description
    }
}
`;

export const GET_TRENDING = gql`
query GETTRENDING{
    get_trending {
      _id
      category_name
      category_type
      subCategory_name
      small_img_url
      is_parent
    }
}`

export const GET_FUTURE = gql`
query GETFUTURE{
    get_is_future {
      _id
      category_name
      category_type
      subCategory_name
      small_img_url
      is_parent
    }
}`
