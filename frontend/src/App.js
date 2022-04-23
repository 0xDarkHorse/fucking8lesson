import React, { Fragment } from 'react';
//import logo from './logo.svg';
import './App.css';
import UserList from './components/Users.js'
import TODOList from './components/TODO.js'
import ProjectList from './components/Project.js'
import LoginForm from './components/Auth.js'
import axios from 'axios'
import Cookies from 'universal-cookie';
//import Footer from './components/Footer';
import { Container, Row, Col } from 'reactstrap';
import Header from './components/Header';

import {HashRouter, BrowserRouter, Route, Link, Switch} from 'react-router-dom'


const NotFound404 = ({ location }) => {
    return (
        <div>
            <h1>Страница по адресу '{location.pathname}' не найдена! Вали отсюда!</h1>
            <HashRouter>
                <Link to='/'>Главная</Link>
            </HashRouter>
        </div>
    )
}

class App extends React.Component {
   constructor(props) {
       super(props)
       this.state = {
           'users': [],
           'projects': [],
           'todos': []
       }
   }
    set_token(token) {
        const cookies = new Cookies()
        cookies.set('token', token)
        this.setState({'token': token}, ()=>this.load_data())
    }
    is_authenticated() {
        return this.state.token != ''
    }
    logout() {
        this.set_token('')
    }

    get_token_from_storage() {
        const cookies = new Cookies()
        const token = cookies.get('token')
        this.setState({'token': token}, ()=>this.load_data())
    }

    get_token(username, password) {
        axios.post('http://127.0.0.1:8000/api-token-auth/', {username: username, password: password})
        .then(response => {
            this.set_token(response.data['token'])
        }).catch(error => alert('Неверный логин или пароль'))
    }

    get_headers() {
        let headers = {
            'Content-Type': 'application/json'
        }
        if (this.is_authenticated())
        {
            headers['Authorization'] = 'Token ' + this.state.token
        }
        return headers
    }

    load_data() {
        const headers = this.get_headers()
        axios.get('http://127.0.0.1:8000/api/users/', {headers})
            .then(response => {
                this.setState({users: response.data})
            }).catch(error => console.log(error))

        axios.get('http://127.0.0.1:8000/api/projects/', {headers})
            .then(response => {
                this.setState({projects: response.data})
            }).catch(error => console.log(error))

        axios.get('http://127.0.0.1:8000/api/todos/', {headers})
            .then(response => {
                this.setState({todos: response.data})
            }).catch(error => {
                console.log(error)
                this.setState({todos: []})
            })
    }

   componentDidMount() {
        this.get_token_from_storage()
        this.load_data()
   }

   render () {
       return (
       <div className="App">
            <BrowserRouter>
                <nav>
                    <ul>
                        <li>
                            <Link to='/'>Authors</Link>
                        </li>
                        <li>
                            <Link to='/todo'>Books</Link>
                        </li>
                        <li>
                        {this.is_authenticated() ? <button onClick={()=>this.logout()}>Logout</button> : <Link to='/login'>Login</Link>}
                        </li>
                    </ul>
                </nav>
                <Switch>
                    <Route exact path='/' component={() => <ProjectList items={this.state.projects} />} />
                    <Route exact path='/todo' component={() => <TODOList items={this.state.todos} />} />
                    <Route exact path='/users' component={() => <UserList users={this.state.users} />} />
                    <Route exact path='/login' component={() => <LoginForm get_token={(username, password) => this.get_token(username, password)} />} />
                    <Route component={NotFound404} />
                </Switch>
            </BrowserRouter>
       </div>
//       <Fragment>
//
//    <Header />
////    <Container>
//    <Row noGutters >
//    </Row>
//    <Row className="mt-4" >
//    </Row>
//        <Row noGutters >
//            <HashRouter>
//                <Switch>
//                    <Route exact path='/' component={() => <ProjectList items={this.state.projects} />} />
//                    <Route exact path='/todo' component={() => <TODOList items={this.state.todos} />} />
////                    <Route path="/todo/:id">
////                        <TODOList items={this.state.books} />
////                    </Route>
//                    <Route exact path='/users' component={() => <UserList users={this.state.users} />} />
//                    <Route exact path='/login' component={() => <LoginForm get_token={(username, password) => this.get_token(username, password)} />} />
//                    <Route component={NotFound404} />
//                </Switch>
//            </HashRouter>
//
//        </Row>
//
//    </Container>
//
//    </Fragment>
       )
   }
}

export default App;
