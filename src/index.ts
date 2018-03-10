
// tslint:disable:no-submodule-imports

// react
import { createElement as r } from 'react'
import { render } from 'react-dom'
import { a, br, div } from 'react-dom-factories'
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom'

// redux
import { Provider } from 'react-redux'
import { applyMiddleware, createStore, Store} from 'redux'
import { createEpicMiddleware, Epic } from 'redux-observable'

// rxjs
import { Observable } from 'rxjs'
import { ajax } from 'rxjs/observable/dom/ajax'

// model
interface User {
  firstName: string,
  lastName: string,
  avatar: string,
}

interface State {
  users: User[]
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

export const fetchInitialTicketsEpic:
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
const home = () =>
  div({},
    div({}, 'home page'),
    br({}),
    r(NavLink, {}, 'goto about'),
    a({}, 'goto contact'),
  )

const about = () =>
  div({},
    div({}, 'about page'),
    br({}),
    a({}, 'goto home'),
    a({}, 'goto contact'),
  )

const contact = () =>
  div({},
    div({}, 'contact page'),
    br({}),
    a({}, 'goto home'),
    a({}, 'goto about'),
  )
// container

// root
interface RootProps {
  store: Store<State>
}

// const b: Route<RouteProps> = r(Route, { path: '/', component: home })

// tslint:disable-next-line:no-shadowed-variable
const Root: React.SFC<RootProps> = ({ store }) =>
  r(Provider, { store },
    r(Router, {},
      r(Route, { path: '/', component: home }),
      r(Route, { path: '/about', component: about }),
      r(Route, { path: '/contact', component: contact }),
    ),
  )

const epicMiddleware = createEpicMiddleware(fetchInitialTicketsEpic, {
  dependencies: {
    getJSON: ajax.getJSON,
  },
})

const store = createStore(users, applyMiddleware(epicMiddleware))

// render
render(
  r(Root, { store }),
  document.getElementById('root'),
)
