module Main exposing (..)

import Html exposing (Html, input, div, button, text, h1, br, i)
import Html.Attributes exposing (placeholder, style, type_, classList)
import Html.Events exposing (onInput, onClick)
import Regex exposing (regex)
import Random
import Task
import Platform
import Platform.Cmd exposing (Cmd)
import Process exposing (sleep)
import Time exposing (Time, second)
import List.Extra exposing (getAt)
import Assets.Dice exposing (..)


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
    { name : String
    , password : String
    , passwordAgain : String
    , age : String
    , validationMsg : ValidationMsg
    , die1 : Maybe Int
    , die2 : Maybe Int
    }


init : ( Model, Cmd Msg )
init =
    ( Model "" "" "" "" Empty (Just 1) (Just 1), Cmd.none )


type ValidationMsg
    = Empty
    | Error String
    | OK


type DieFace
    = WorldIcon
    | MusicIcon
    | GithubIcon
    | HeartIcon
    | ForkIcon
    | CloudIcon



-- UPDATE


type Msg
    = Name String
    | Password String
    | PasswordAgain String
    | Age String
    | Submit
    | Roll
    | GetNewFaces
    | NewFaces (List Int)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Name name ->
            ( { model | name = name }, Cmd.none )

        Password password ->
            ( { model | password = password }, Cmd.none )

        PasswordAgain password ->
            ( { model | passwordAgain = password }, Cmd.none )

        Age age ->
            ( { model | age = age }, Cmd.none )

        Submit ->
            ( { model | validationMsg = validate model }, Cmd.none )

        Roll ->
            model ! [ delay (Time.second * 1), delay (Time.second * 1) ]

        GetNewFaces ->
            model ! [ setNewFace ]

        NewFaces list ->
            ( { model | die1 = getAt 0 list, die2 = getAt 1 list }, Cmd.none )


validate : Model -> ValidationMsg
validate model =
    if String.length model.password < 9 then
        Error "Password must be longer than 8 characters"
    else if not (Regex.contains (regex "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$") model.password) then
        Error "Password must be mixed case"
    else if model.password /= model.passwordAgain then
        Error "Passwords do not match!"
    else if Result.withDefault 0 (String.toInt model.age) == 0 then
        Error "Age must be a number > 0"
    else
        OK


setNewFace : Cmd Msg
setNewFace =
    Random.generate NewFaces <| Random.list 2 <| Random.int 1 6


delay : Time -> Cmd Msg
delay time =
    Process.sleep time
        |> Task.andThen (always <| Task.succeed GetNewFaces)
        |> Task.perform identity



--    Task.perform identity ((Task.andThen (always (Process.sleep time)) (Task.succeed GetNewFaces)))
--    Task.perform identity (always <| Task.succeed GetNewFaces)
--waitAndRoll : Cmd msg
--waitAndRoll =
--    Task.perform (Process.sleep (second * 1))
-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


view : Model -> Html Msg
view model =
    div []
        [ div
            [ classList
                [ ( "input", True )
                , ( "ui", True )
                ]
            ]
            [ input [ type_ "text", placeholder "Name", onInput Name ] [] ]
        , div
            [ classList
                [ ( "input", True )
                , ( "ui", True )
                ]
            ]
            [ input [ type_ "password", placeholder "Password", onInput Password ] [] ]
        , div
            [ classList
                [ ( "input", True )
                , ( "ui", True )
                ]
            ]
            [ input [ type_ "password", placeholder "Re-enter Password", onInput PasswordAgain ] [] ]
        , div
            [ classList
                [ ( "input", True )
                , ( "ui", True )
                ]
            ]
            [ input [ type_ "text", placeholder "Age", onInput Age ] [] ]
        , div []
            [ button
                [ classList
                    [ ( "button", True )
                    , ( "ui", True )
                    ]
                , onClick Submit
                ]
                [ text "Submit" ]
            ]
        , viewValidation model
        , br [] []
        , br [] []
        , dieFaceRender model.die1
        , dieFaceRender model.die2
        , div []
            [ button
                [ classList
                    [ ( "button", True )
                    , ( "ui", True )
                    ]
                , onClick Roll
                ]
                [ text "Roll" ]
            ]
        ]


viewValidation : Model -> Html msg
viewValidation model =
    let
        ( color, message ) =
            case model.validationMsg of
                Empty ->
                    ( "", "" )

                Error message ->
                    ( "red", message )

                OK ->
                    ( "green", "OK" )
    in
        div [ style [ ( "color", color ) ] ] [ text message ]


dieFaceRender : Maybe Int -> Html msg
dieFaceRender dieFace =
    case dieFace of
        Just 1 ->
            Assets.Dice.die1

        Just 2 ->
            Assets.Dice.die2

        Just 3 ->
            Assets.Dice.die3

        Just 4 ->
            Assets.Dice.die4

        Just 5 ->
            Assets.Dice.die5

        Just 6 ->
            Assets.Dice.die6

        _ ->
            Assets.Dice.die1
