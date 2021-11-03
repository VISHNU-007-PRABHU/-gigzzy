import gql from "graphql-tag";

export const BOOKING_CHART = gql`
    query GETBOOKING($option:Int){
        get_booking_chart(option: $option){
            _id
            count
        }
}`

export const CANCEL_CHART = gql`
    query CANCELCHART($option:Int){
        get_cancel_chart(option: $option){
            _id
            count
        }
}`

export const EARNINGS_CHART = gql`
    query EARNINGSCHART{
        get_earnings_chart{
            _id
            total
        }
}`

export const OTHERS_CHART = gql`
    query OTHERSCHART{
        get_others_chart {
            revenue
            earning
            user
            provider
        }
    }`
