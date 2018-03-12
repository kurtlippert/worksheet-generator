
// tslint:disable:no-submodule-imports

// react
import * as React from 'react'
const r = React.createElement
import { render } from 'react-dom'
import { br, div, hr, li, tbody, th, thead, tr, ul } from 'react-dom-factories'
// import { BrowserRouter as Router, NavLink, Route, Switch, withRouter } from 'react-router-dom'
// import { BrowserRouter as Router, NavLink, Route, Switch } from 'react-router-dom'
import { BrowserRouter as Router, NavLink } from 'react-router-dom'

// redux
// import { connect, Provider } from 'react-redux'
import { connect, Provider } from 'react-redux'
import { applyMiddleware, createStore, Store} from 'redux'
import { createEpicMiddleware, Epic } from 'redux-observable'

// rxjs
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mergeMap'
import { ajax } from 'rxjs/observable/dom/ajax'

// typestyle
import { style } from 'typestyle'

// react-bootstrap
import { Table } from 'react-bootstrap'
import { withRouter } from 'react-router'

// model
interface User {
  firstName: string,
  lastName: string,
  avatar: string,
}

interface State {
  users: User[]
  location: 'HOME' | 'ABOUT' | 'TOPICS'
  // items: any
  // firstName: string,
  // lastName: string,
  // avatar: string,
}

// action
type Action =
  | { type: 'FETCH_USERS' }
  | { payload: User[], type: 'FETCH_USERS_FULFILLED' }

const fetchUsers = (): Action => ({
  type: 'FETCH_USERS',
})

const fetchUsersFulfilled = (payload: User[]): Action => ({
  payload,
  type: 'FETCH_USERS_FULFILLED',
})

// update
// epics
// https://reqres.in/api/users
interface EpicDependencies {
  getJSON: (url: string) => Observable<User[]>
}

export const fetchUsersEpic:
  Epic<Action, Store<State>, EpicDependencies> =
  (action$, _, { getJSON }) =>
    action$.ofType('FETCH_USERS')
      .mergeMap(() =>
        getJSON('https://reqres.in/api/users?page=1')
          .map((response) =>
            fetchUsersFulfilled(response),
          ),
      )

// reducers
const users = (state: State, action: Action): State => {
  switch (action.type) {
    case 'FETCH_USERS_FULFILLED':
      return {
        ...state,
        users: action.payload,
      }
    default:
      return state
  }
}

// view
// tslint:disable-next-line:variable-name
// const _home: React.SFC<{ state: State, location: any }> = ({ location }) => {
// tslint:disable-next-line:variable-name
const home = () => {
  // tslint:disable-next-line:no-console
  // console.log(location)
  return div({},
    div({}, 'home page'),
  )
}

// const home = withRouter(
//   (connect(
//     (_: State, ownProps: any) => ({ location: ownProps.location }),
//   )(_home)) as any)

// tslint:disable-next-line:variable-name
const about = () =>
  div({},
    div({}, 'about page'),
    r(Table, { responsive: true },
      thead({},
        tr({},
          th({}, '#'),
          th({}, 'heading 1'),
          th({}, 'heading 2'),
        ),
      ),
      tbody({},
        tr({}, '1'),
        tr({}, 'item 1'),
        tr({}, 'item 2'),
      ),
    ),
  )

// const about = withRouter((connect()(_about)) as any)

// tslint:disable-next-line:variable-name
const topics = () =>
  div({},
    div({}, 'topic page'),
  )

// const topics = withRouter((connect()(_topics)) as any)

// root
// interface ConnectedContainerProps {
//   state: State
//   location: any
// }

// const b: Route<RouteProps> = r(Route, { path: '/', component: home })

// tslint:disable-next-line:no-shadowed-variable
// tslint:disable-next-line:variable-name
// tslint:disable-next-line:class-name
// class _ConnectedContainer extends React.PureComponent {
  // public render() {
// tslint:disable-next-line:variable-name
const _ConnectedContainer: React.SFC<{ state: State, location: any }> = ({ state, location }) => {
    // tslint:disable-next-line:no-console
    console.log(location)
    return div({},
      // (this.props as any).location.pathname,
      location.pathname,
      br({}),
      br({}),
      location.pathname === '/'
        ? r(home)
        : location.pathname === '/about'
          ? r(about)
          : location.pathname === '/topics'
            ? r(topics)
            : r(home),
      // r(Switch, {},
      //   r(Route, { path: '/', component: home }),
      //   r(Route, { path: '/about', component: about }),
      //   r(Route, { path: '/topics', component: topics }),
      // ),
    )
  }
// }

const ConnectedContainer = withRouter(
  connect(
    (state: State, ownProps: any) => ({ state, location: ownProps.location }),
  )(_ConnectedContainer) as any)

// const ConnectedContainer = withRouter(_ConnectedContainer as any)

interface RootProps {
  store: Store<State>
}

// tslint:disable-next-line:no-shadowed-variable
const Root: React.SFC<RootProps> = ({ store }) => {
  // tslint:disable-next-line:no-console
  console.log(store)
  return r(Provider, { store },
    r(Router, {},
      div({ className: style({ marginTop: '10px' }) },
        ul({},
          li({}, r(NavLink, { to: '/' }, 'Home')),
          li({}, r(NavLink, { to: '/about' }, 'About')),
          li({}, r(NavLink, { to: '/topics' }, 'Topics')),
        ),
        hr({}),
        r(ConnectedContainer),
      ),
    ),
  )
}

const epicMiddleware = createEpicMiddleware(fetchUsersEpic, {
  dependencies: {
    getJSON: ajax.getJSON,
  },
})

const initialState: State = {
  location: 'HOME',
  users: [],
}

const store = createStore(users, initialState, applyMiddleware(epicMiddleware))

// render
render(
  r(Root, { store }),
  document.getElementById('root'),
)

store.dispatch(fetchUsers())
