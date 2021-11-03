
import gql from "graphql-tag";

export const GET_REVIEW = gql`
 query GETREVIEW($limit: Int,$page:Int,$data:JSON) {
    get_review(limit:$limit,page:$page,data:$data) {
        pageInfo {
        totalDocs
        page
      }
      data {
        booking_ref
        user_rating
        _id
        user_comments
        user_comments_status
        booking_user{
            name
        }
      }
    }
 }
`;


export const UPDATE_BOOKING_DETAIL = gql`
    mutation UPDATEBOOKINGDETAIL($booking_id:ID,$user_comments_status:Int){
        update_booking_details(booking_id:$booking_id,user_comments_status:$user_comments_status){
            msg
            status
        }
    }
`;



