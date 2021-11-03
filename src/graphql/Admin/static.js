import gql from "graphql-tag";

export const ADD_STATIC = gql`
    mutation ADDSTATIC($page_name: String,$page_code: String,$description: String,$title:String) {
        add_static(page_name:$page_name,page_code:$page_code,description:$description,title:$title){
            info
        }
    }
`;

export const UPDATE_STATIC = gql`
    mutation update_STATIC($_id:ID,$page_name:String,$page_code: String,$description: String,$title:String){
        update_static(_id:$_id,page_name:$page_name,page_code:$page_code,description:$description,title:$title){
            info
        }
    }
`;

export const GET_STATIC = gql`
 query GETSTATIC($limit: Int,$page:Int) {
    get_static(limit:$limit,page:$page) {
        pageInfo{
            totalDocs
        }
        data{
            _id
            page_name
            page_code
            description
            title
        }
    }
}
`;

export const DELETE_STATIC = gql`
    mutation DELETESTATIC($_id: ID)  {
    deleteStatic(_id:$_id){
        msg   
        status      
    }
}`



export const FIND_STATIC = gql`
query FINDSTATIC($_id:ID) {
    static(_id:$_id) {
        _id
        page_name
        page_code
        title
        description
    }
}
`;

export const USER_STATIC = gql`
query USERSTATIC($_id:ID,$page_code:String) {
    static(_id:$_id,page_code:$page_code) {
        _id
        page_name
        page_code
        title
        description
    }
}
`;

export const ADD_SETTING = gql`
    mutation ADDSETTING($_id:ID,
            $site_name: String,
            $site_email: String,
            $copyrights_content: String,
            $playstore_link: String,
            $appstore_link: String,
            $contact_number: String,
            $contact_email: String,
            $site_currency: String) {
        add_site_detail(_id:$_id,
            site_name: $site_name,
            site_email: $site_email,
            copyrights_content: $copyrights_content,
            playstore_link: $playstore_link,
            appstore_link: $appstore_link,
            contact_number: $contact_number,
            contact_email: $contact_email,
            site_currency: $site_currency){
            msg
            status
        }
    }
`;
export const GET_SETTING = gql`
query GTESETTING {
    site_setting_detail {
        site_email
        site_name
        site_name
        site_email
        copyrights_content,
        playstore_link
        appstore_link
        contact_number
        contact_email
        site_currency
        img_logo
        img_icon
        site_logo
        site_icon
    }
}
`;


export const ADD_PAYOUT = gql`
    mutation ADDPAYOUT($_id:ID,
            $user_name:String,
            $password:String,
            $secret_key:String,
            $client_key:String,
            $signature:String,
            $payout_status:Int) {
            add_payout_detail( _id:$_id,
                user_name:$user_name,
                password:$password,
                secret_key:$secret_key,
                client_key:$client_key,
                signature:$signature,
                payout_status:$payout_status){
                    user_name,
                    password
                    secret_key
                    client_key
                    signature
                    payout_status
                    msg
                    status
                }
    }
`;

export const GET_PAYOUT_SETTING = gql`
query GTEPAYOUTSETTING {
    payout_setting_detail {
        user_name,
        password
        secret_key
        client_key
        signature
        payout_status
        msg
        status
    }
}
`;



export const UPDATE_SITE_IMG = gql`
    mutation UPDATESITEIMG($_id: ID,$file:Upload,$option:Int)  {
        update_site_img(_id:$_id,file:$file,option:$option){
        msg         
        status
        img_icon
        img_logo
        site_logo
        site_icon
    }
}`
