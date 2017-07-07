import {html} from 'snabbdom-jsx'
import xs from 'xstream'

function view(state$) {
  const labeledInput = (id, label, type="text", value="") => (
    <div className="form-group row">
      <div className="col-md-4 col-sm-5">
        <label for={id} className="col-form-label">{label}: </label>
      </div>
      <div className="col-md-8 col-sm-7">
        <input id={id} name={id} type={type} value={value} placeholder={label} className="form-control"/>
      </div>
    </div>
  )
  return state$.map(state => 
    <div className="row">
      <div className="card col-md-4 offset-md-4 p-0">
        <div className="card-header">Login</div>
        <div className="card-block">
          { labeledInput("text-login","Login") }
          { labeledInput("text-password","Password","password") }
          <div className="row">
            <div className="offset-md-5 offset-sm-4">
              {(state.login && state.password) ? (
                <a href="#" className="btn btn-primary">Sign In</a>
              ) : (
                <span>User, password not here!!</span>
              )}
              <br/><span>{state.response ? state.response.email: ''}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function intent(sources) {
  const inputLogin$ = sources.DOM.select('#text-login')
    .events('input')
    .map(ev =>  ev.target.value)
    .map(payload => ({type: 'inputLogin', payload}));

  const inputPassword$ = sources.DOM.select('#text-password')
    .events('input')
    .map(ev =>  ev.target.value)
    .map(payload => ({type: 'inputPassword', payload}));

  const clickLogin$ = sources.DOM.select('.btn')
    .events('click')
    .mapTo({
      type: 'clickLogin',
      payload: {
        url: 'https://jsonplaceholder.typicode.com/users/',
          category: 'users',
          method: 'GET'
      }});

  const responseUser$ = sources.HTTP.select('users')
    .map(res$ => res$.replaceError(xs.of))
    .flatten()
    .map(res => res.body ? {type: 'responseUser', payload: res.body} : {type: 'responseUserError', payload: res})

    return xs.merge(inputLogin$, inputPassword$, responseUser$, clickLogin$);
}

function model(action$) {
  const initState = {};
  return action$.fold((state, action) => {
    if(action.type === 'inputLogin') {
      return {...state, login: action.payload}
    } else if(action.type === 'inputPassword') {
      return {...state, password: action.payload}
    } else if(action.type === 'clickLogin') {
      return {...state, request: {...action.payload, url: action.payload.url + state.login}}
    } else if(action.type === 'responseUser') {
      return {...state, response: action.payload, request: null, err: null}
    } else if(action.type === 'responseUserError') {
      return {...state, err: action.payload, request: null}
    }

  }, initState);
}

export function App (sources) {
  const action$ = intent(sources);
  const state$ = model(action$).startWith({}).debug("state");
  const vtree$ = view(state$);
  const sinks = {
    DOM: vtree$,
    HTTP: state$.filter(s => s.request).map(s => ({...s.request}))
  }
  return sinks
}
