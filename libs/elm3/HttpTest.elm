port module HttpTest exposing (..)

import Html exposing (Html, text, div, h2, img, button, input, br, select, option)
import Html.Attributes exposing (src, classList, type_, placeholder, value)
import Html.Events exposing (onClick, onInput)
import Platform.Cmd exposing (Cmd)
import Http
import Json.Decode exposing (Decoder, at, string)


--uncomment if needed -- import Html.App as App


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- MODEL


type alias Model =
    { topic : String
    , gifUrl : String
    }


init : ( Model, Cmd Msg )
init =
    Model "cats" "waiting.gif" ! []



-- UPDATE


type Msg
    = MorePlease
    | NewGif (Result Http.Error String)
    | Topic String


type GifMsg
    = Good String
    | Bad String


port alert : String -> Cmd msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        MorePlease ->
            ( model, getRandomGif model.topic )

        Topic topic ->
            { model | topic = topic } ! []

        NewGif (Ok newUrl) ->
            ( { model | gifUrl = newUrl }, Cmd.none )

        NewGif (Err error) ->
            ( model, alert (httpErrorString error) )


getGifMsgText : GifMsg -> String
getGifMsgText gifMsg =
    case gifMsg of
        Good message ->
            message

        Bad message ->
            message


getRandomGif : String -> Cmd Msg
getRandomGif topic =
    let
        url =
            "https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=" ++ topic

        request =
            Http.get url decodeGifUrl
    in
        Http.send NewGif request


decodeGifUrl : Decoder String
decodeGifUrl =
    at [ "data", "image_url" ] string


httpErrorString : Http.Error -> String
httpErrorString error =
    case error of
        Http.BadUrl text ->
            "Bad Url: " ++ text

        Http.Timeout ->
            "Http Timeout"

        Http.NetworkError ->
            "Network Error: We're having trouble getting your cat gif"

        Http.BadStatus response ->
            "Bad Http Status: " ++ toString response.status.code

        Http.BadPayload message response ->
            "Bad Http Payload: " ++ toString message ++ " (" ++ toString response.status.code ++ ")"



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


view : Model -> Html Msg
view model =
    div []
        [ h2 [] [ text model.topic ]
        , img [ src model.gifUrl ] []
        , div []
            [ button [ onClick MorePlease ] [ text "More Please" ] ]
        , div []
            [ br [] []
            , div [] [ text "Enter Topic: " ]
            , select [ value model.topic, onInput Topic ]
                [ option [ value "cats" ] [ text "cats" ]
                , option [ value "dogs" ] [ text "dogs" ]
                , option [ value "mice" ] [ text "mice" ]
                ]
            ]
        ]
