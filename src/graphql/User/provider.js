import gql from "graphql-tag";


export const GET_EARNINGS = gql`
 query GETEARNINGS($provider_id:ID,$option:Int,$limit:Int,$page:Int,$booking_status:Int){
    get_payout(provider_id:$provider_id,option:$option,limit:$limit,page:$page,booking_status:$booking_status)
    {
      pageInfo {
         totalDocs
         page
         total_amount
       }
       data {
         _id
        booking_ref
        category_type
        booking_date
        provider_fee
        created_date
        booking_category {
           category_name
           subCategory_name
           img_url
           category_type
         }
       }
    }
}`