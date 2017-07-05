import {html} from 'snabbdom-jsx'
import xs from 'xstream'

function view() {
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
  return (
    <div className="row">
      <div className="card col-md-4 offset-md-4 p-0">
        <div className="card-header">Login</div>
        <div className="card-block">
          { labeledInput("text-login","Login") }
          { labeledInput("text-password","Password","password") }
          <div className="row">
            <div className="offset-md-5 offset-sm-4">
              <a href="#" className="btn btn-primary">Sign In</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
}

export function App (sources) {
  const vtree$ = xs.of(
    view()
  );
  const sinks = {
    DOM: vtree$
  }
  return sinks
}
