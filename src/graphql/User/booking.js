import gql from "graphql-tag";

export const SEND_ACCEPT_MSG = gql`
subscription SENDACCEPTMSG($_id:ID,$booking_id:ID){
    send_accept_msg (_id:$_id,booking_id:$booking_id){
      _id
      status
      description
      booking_ref
      booking_date
      base_price
      extra_price
      msg_date
      msg_time
      booking_provider {
        _id
        name
        lat
        lng
        img_url
        rating
      }
    }
}`

export const PENDING_DATA = gql`
subscription getPendingDataSubscription($_id: ID
$role: Int
$booking_status: Int
){
  get_my_appointments(_id: $_id, role: $role, booking_status: $booking_status)
  {
    _id
    status
    description
    base_price
    booking_date
    jobStart_time
    jobEnd_time
    booking_status
    user_image_url
    start_job_image_url
    end_job_image_url
    booking_type
    user_msg_count
    provider_msg_count
    user_msg_is_read
    provider_msg_is_read
    booking_category {
      category_name
      subCategory_name
      category_type
      description
      _id
      base_price
      hour_price
      hour_limit
      img_url
      booking_parent_category{
        category_name
      }
    }
    booking_user {
      name
      lat
      lng
      phone_no
      phone_number
      _id
      img_url
    }
    booking_provider {
      name
      lat
      lng
      phone_no
      _id
      img_url
    }
    # find_kilometre(lat: $lat, lng: $lng) {
    #   kilometre
    # }
  }
}`

export const TSET = gql`
subscription TESTS($online:String){
    test (online:$online){
      status
      msg
    }
}`


export const ADD_BOOKING = gql`
 mutation ADDBOOKING($user_id:ID,$booking_time:String,$booking_hour:String,$booking_type:Int,$category_id:ID,$category_type:Int,$lat:Float,$lng:Float,$hours:String,$description:String,$booking_status:Int,$booking_date:String,$file:[Upload]) {
    add_booking(
      user_id: $user_id,
      category_id: $category_id
      category_type: $category_type
      lat: $lat
      lng: $lng
      hours: $hours
      description: $description
      booking_status: $booking_status,
      booking_type:$booking_type,
      booking_date:$booking_date,
      booking_time:$booking_time,
      booking_hour:$booking_hour,
      file:$file
    ) {
      id
      description
      location
      lat
      lng
      user_image_url
      user(_id:$user_id) {
        name
      }
      provider {
        name
        _id
      }
      category(_id: $category_id, category_type: $category_type) {
        category_name
        subCategory_name
        base_price
        hour_price
        hour_limit
        description
        img_url
      }
      hours
    }
  }
  `

export const ACCEPT_JOB_MSG = gql`
mutation AcceptJobMutation($role: Int
  $booking_id: ID
  $provider_id: ID
  $booking_status:Int
  $phone_number : String
  $payment_type : String
){
  manage_booking(
    role:$role
    booking_id: $booking_id
    provider_id: $provider_id
    booking_status: $booking_status
    phone_number : $phone_number
    payment_type:$payment_type
  ){
    status
    msg
  }
}`

export const My_APPOINTMENTS = gql`
query My_appointments($_id : ID,$role : Int,$booking_status : Int,$limit:Int,$page:Int)
{
  get_my_appointments(_id:$_id,role:$role,booking_status:$booking_status,limit:$limit,page:$page){
    pageInfo{
      totalDocs
      page
    }
    data{
            _id
          booking_status
          booking_date
          base_price
          booking_ref
          booking_type
          booking_date
          user_msg_count
          provider_msg_count
          user_msg_is_read
          provider_msg_is_read
          booking_category{
          img_url
          category_type
          category_name
          subCategory_name
          is_parent
            booking_parent_category{
              category_name
              img_url
            }
          }
          booking_provider{
            name
            img_url
            phone_number
          }
        }
    }
}`

export const GET_PARTICULAR_BOOKING = gql`
query GETPARTICULARBOOKING($_id : ID) {
  booking(_id:$_id) {
        _id
        description
        user_image_url
        booking_status
        booking_date
        created_at
        job_start_time
        job_end_time
        start_job_image_url
        end_job_image_url
        booking_ref
        base_price
        extra_price
        extra_hour_price
        total
        final_payment
        charge_id
        MpesaReceiptNumber
        mpeas_payment_callback
        ctob_shotcode
        ctob_billRef
        admin_fee
        service_fee
        lat
        lng
        provider_fee
        payment_status
        payment_type
        user_rating
        user_rating_status
        actual_time
        user_msg_count
          provider_msg_count
          user_msg_is_read
          provider_msg_is_read
      user_comments
      provider_rating
      provider_comments
      booking_type
      get_booking_message(booking_id:$_id){
          message
          createdAt
          role
          msg_date
          msg_time
        }
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
        booking_provider{
          name
          email
          phone_number
          _id
          img_url
          lat
          lng
        }
        booking_user {
          name
          phone_number
          email
          img_url
          location
        }
      }
    }`

export const GET_MSG = gql`
  query GETMSG($booking_id : ID,$user_id:ID,$provider_id:ID) {
    get_message(booking_id:$booking_id){
      message
      createdAt
      role
      msg_date
      msg_time
      user(_id:$user_id){
        name
        img_url
      }
      provider(_id:$provider_id){
        name
        img_url
      }
    }
  }`

export const ADD_MSG = gql`
mutation ADDMSG($booking_id : ID,$user_id:ID,$data:String){ 
  add_message(
    role:1
    booking_id: $booking_id
    user_id: $user_id
    message: $data
  ) {
    message
  }
}`

export const UPDATE_MANUAL_PAYMENT =  gql`
mutation UPDATE_MANUAL_PAYMENT($booking_id : ID,$role:Int,){ 
  update_manual_payment(role:$role,booking_id: $booking_id) {
    msg
    status
  }
}`

export const UPDATE_MSG_COUNT = gql`
mutation UPDATE_MSG_COUNT($booking_id : ID,$role:Int,){ 
  update_msg_is_read(role:$role,booking_id: $booking_id) {
    msg
    status
  }
}`


export const MSG_SUB = gql`
subscription MSGSUB($booking_id : ID,$user_id:ID,$provider_id:ID){ 
	messageSent(booking_id:$booking_id){
    	message
      createdAt
      msg_date
      msg_time
      role
      user(_id:$user_id){
        name
        img_url
      }
      provider(_id:$provider_id){
        name
        img_url
      }
  }
}`


export const ADD_COMMENTS = gql`
mutation ADDCOMMENTS($booking_id : ID,$user_id:ID,$rating:Int,$comments:String){ 
  addRating(
    role:1
    booking_id: $booking_id
    user_id: $user_id
    rating: $rating
    comments:$comments
  ) {
    user_rating_status
    msg
    status
  }
}`






