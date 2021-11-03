import gql from "graphql-tag";

export const ADD_USER = gql`
    mutation ADDUSER($role:Int,$country_code:String,$phone_no:String,$email:String,$password:String,$name:String,$provider_subCategoryID:[ID],$lat:Float,$lng:Float,$address:String) {
        admin_add_user(role:$role,country_code:$country_code,phone_no:$phone_no,email:$email,password:$password,name:$name,provider_subCategoryID:$provider_subCategoryID,lat:$lat,lng:$lng,address:$address){
            info
        }
    }
`;

export const UPDATE_USER = gql`
    mutation UPDATEUSER($_id:ID,$role:Int,$country_code:String,$phone_no:String,$email:String,$password:String,$name:String,$provider_subCategoryID:[ID],$lat:Float,$lng:Float,$address:String) {
        admin_update_user(_id:$_id,role:$role,country_code:$country_code,phone_no:$phone_no,email:$email,password:$password,name:$name,provider_subCategoryID:$provider_subCategoryID,lat:$lat,lng:$lng,address:$address){
            info
        }
    }
`;

export const GET_BOOKING = gql`
 query GETBOOKING($limit: Int,$page:Int,$booking_status:[Int],$payment_status:[Int],$user_id:ID,$provider_id:ID,$booking_date:JSON,$category_id:ID,$booking_ref:JSON) {
    get_booking(limit:$limit,page:$page,booking_status:$booking_status,payment_status:$payment_status,user_id:$user_id,provider_id:$provider_id,booking_date:$booking_date,category_id:$category_id,booking_ref:$booking_ref) {
        pageInfo {
            totalDocs
            page
        }
        data {
          _id
            description
            category_type
            status
            booking_date
            booking_ref
            booking_status
            booking_provider {
                name
            }
            booking_category {
                category_name
                subCategory_name
                category_type
                booking_parent_category {
                    category_name
                }
            }
            booking_user {
                name
            }
        }
    }
}
`;


export const GET_PROVIDER_BOOKING = gql`
 query GETPROVIDERBOOKING($limit: Int,$page:Int,$booking_status:[Int],$payment_status:[Int],$provider_id:ID) {
    get_booking(limit:$limit,page:$page,booking_status:$booking_status,payment_status:$payment_status,provider_id:$provider_id) {
        pageInfo {
            totalDocs
            page
        }
        data {
          _id
            description
            category_type
            status
            booking_date
            booking_status
            booking_provider {
                name
            }
            booking_category {
                category_name
                subCategory_name
                category_type
                booking_parent_category {
                    category_name
                }
            }
            booking_user {
                name
            }
        }
    }
}
`;

export const DELETE_CERTIFICATE = gql`
    mutation DELETECERTIFICATE($_id: ID)  {
    deletecertificate(_id:$_id){
        msg         
    }
}`



export const FIND_USER = gql`

query FINDUSER($_id:ID) {
    user(_id:$_id) {
        _id
        country_code
        phone_no
        demo
        email
        name
        address
        location
        password
        provider_subCategoryID
        provider_document_url
        proof_status
    }
}
`;


export const PROVIDER_DOCUMENT_VERIFIED = gql`
mutation PROVIDERDOCUMENTVERIFIED($_id:ID,$proof_status:String) {
    provider_document_verified(_id:$_id,proof_status:$proof_status) {
        info
        provider_document_url
        proof_status
    }
}
`;

export const GET_PAYOUT = gql`
query GETPAYOUT($provider_id:ID,$option:Int,$booking_status:Int,$limit:Int,$page:Int){
    get_payout(
      provider_id: $provider_id
      option: $option
      booking_status: $booking_status
      limit: $limit
      page: $page
    ) {
      pageInfo {
        totalDocs
        page
        total_amount
      }
      data {
        _id
        booking_ref
        category_type
        provider_fee
        booking_category {
          category_name
          subCategory_name
          category_type
        }

      }
    }
}`

export const GET_ALL_PAYOUT = gql`
  query GETALLPAYOUT ($limit:Int,$page:Int,$provider_id:ID){
    get_all_payout(limit:$limit,page:$page,provider_id:$provider_id) {
      pageInfo {
        totalDocs
        page
      }
  
      data {
        _id
        total_amount
        find_payout_provider {
          name
        }
      }
    }
  }
`


export const GET_PAYOUT_DETAIL = gql`
  query GETPAYOUTDETAIL ($data:JSON){
    get_payout_detail(data:$data) {
            _id
        amount
        provider_id
        booking_provider{
          name
          account_no
          bank_name
          ifsc_code
          kra_pin
          payout_phone
          payout_frist_name
          payout_second_name
          payout_id
          payout_option
          account_name
          routing_name
          branch_name
        }
        find_payout_booking{
		    booking_ref	
            booking_category {
                category_name
                category_type
                subCategory_name
                description
                _id
                base_price
                hour_price
                hour_limit
                img_url
                booking_parent_category {
                category_name
                category_name
                }
            }
        }
    }
}
`

export const ADMIN_TO_PROVIDER = gql`
mutation ADMINTOPROVIDER($provider_id:ID,$booking_status:Int,$status:Int) {
  pay_admin_to_provider(provider_id:$provider_id,booking_status:$booking_status,status:$status) {
        msg
        status
    }
}
`;