import React, { PureComponent } from 'react'
import code from '../../Assets/img/code.svg'
import github from '../../Assets/img/github.svg'
import './style.css'

export default class Header extends PureComponent {
  static propTypes = {}

  render() {
    return (
      <nav className="Header row between middle">
        <div className="Header-left row middle">
          <h1>Speechless</h1>
          <div>
            <a href="https://puemos.github.io/speechless">Docs</a>
          </div>
        </div>

        <div className="Header-right row middle around">
          <div>
            <a href="https://github.com/puemos/speechless/tree/master/demo">
              <img src={code} className="Header-code-logo" alt="code" />
            </a>
          </div>

          <div>
            <a href="https://github.com/puemos/speechless">
              <img src={github} className="Header-github-logo" alt="github" />
            </a>
          </div>
        </div>
      </nav>
    )
  }
}
