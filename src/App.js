import { STATE_LOGIN, STATE_SIGNUP } from './components/AuthForm';
import GAListener from 'components/GAListener';
import { EmptyLayout, LayoutRoute, MainLayout } from 'components/Layout';
import PageSpinner from 'components/PageSpinner';
import AuthPage from './pages/AuthPage';
import componentQueries from 'react-component-queries';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './styles/reduction.scss';
import { AuthProvider } from './components/Context/authContext'

import React, { Fragment, useState, useEffect } from "react";

import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

toast.configure();

const AlertPage = React.lazy(() => import('pages/AlertPage'));
const AuthModalPage = React.lazy(() => import('pages/AuthModalPage'));
const BadgePage = React.lazy(() => import('pages/BadgePage'));
const ButtonGroupPage = React.lazy(() => import('pages/ButtonGroupPage'));
const ButtonPage = React.lazy(() => import('pages/ButtonPage'));
const CardPage = React.lazy(() => import('pages/CardPage'));
const ChartPage = React.lazy(() => import('pages/ChartPage'));
const DashboardPage = React.lazy(() => import('pages/DashboardPage'));
const DropdownPage = React.lazy(() => import('pages/DropdownPage'));
const FormPage = React.lazy(() => import('pages/FormPage'));
const InputGroupPage = React.lazy(() => import('pages/InputGroupPage'));
const ModalPage = React.lazy(() => import('pages/ModalPage'));
const ProgressPage = React.lazy(() => import('pages/ProgressPage'));
const TablePage = React.lazy(() => import('pages/TablePage'));
const TypographyPage = React.lazy(() => import('pages/TypographyPage'));
const WidgetPage = React.lazy(() => import('pages/WidgetPage'));
const AboutUs = React.lazy(() => import('pages/AboutUs'));
const ProfileSetting = React.lazy(() => import('pages/ProfileSetting'));
// const Chat = React.lazy(() => import('pages/chat/Chat'));
const Join = React.lazy(() => import('pages/chat/Join'));

// const getBasename = () => {
//   return `/${process.env.PUBLIC_URL.split('/').pop()}`;
// };

// console.log('%c Hello', 'color:red;')
// console.table([toast, 'lll'])



function App(props) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthenticated = async () => {
    //console.time('fetch')

    try {
      const res = await fetch("http://localhost:4000/api/verify", {
        method: "POST",
        headers: { jwt_token: localStorage.token }
      });
      const parseRes = await res.json();
      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (err) {
      console.error(err.message);
    }
    
    //console.timeEnd('fetch')

  };

  const setAuth = boolean => {
    setIsAuthenticated(boolean);
  };

  useEffect(() => {
    checkAuthenticated();
  }, [isAuthenticated, setAuth]);

  return (
    <Fragment>
      <BrowserRouter basename={'/'}>
        <GAListener>
          <Switch>
            <LayoutRoute
              exact
              path="/login"
              layout={EmptyLayout}
              component={props => (
                <AuthProvider value={{ setAuth: setAuth }}>
                  <AuthPage {...props} authState={STATE_LOGIN} />
                </AuthProvider>
              )}
            />

            <LayoutRoute
              exact
              path="/signup"
              layout={EmptyLayout}
              component={props => (
                <AuthProvider value={{ setAuth: setAuth }}>
                  <AuthPage {...props} authState={STATE_SIGNUP} />
                </AuthProvider>
              )}
            />

            <MainLayout breakpoint={props.breakpoint}>
              <React.Suspense fallback={<PageSpinner />}>
                <Route exact path="/" component={DashboardPage} />

                <Route exact path="/login-modal" component={props => (
                  <AuthProvider value={{ setAuth: setAuth }}>
                    <AuthModalPage {...props} authState={STATE_LOGIN} />
                  </AuthProvider>
                )} />
                <Route exact path="/buttons" component={ButtonPage} />
                <Route exact path="/cards" component={CardPage} />
                <Route exact path="/profile-setting" component={ProfileSetting} />
                <Route exact path="/widgets"
                  render={props =>
                    isAuthenticated ? (
                      <WidgetPage {...props} setAuth={setAuth} />
                    ) : (
                        <Redirect to="/login-modal" />
                      )
                  }
                />
                <Route exact path="/typography" component={TypographyPage} />
                <Route exact path="/aboutus" component={AboutUs} />
                <Route exact path="/join" component={Join} />

                <Route exact path="/alerts" component={AlertPage} />
                <Route exact path="/tables" component={TablePage} />
                <Route exact path="/badges" component={BadgePage} />
                <Route
                  exact
                  path="/button-groups"
                  component={ButtonGroupPage}
                />
                <Route exact path="/dropdowns" component={DropdownPage} />
                <Route exact path="/progress" component={ProgressPage} />
                <Route exact path="/modals" component={ModalPage} />
                <Route exact path="/forms" component={FormPage} />
                <Route exact path="/input-groups" component={InputGroupPage} />
                <Route exact path="/charts" component={ChartPage} />
              </React.Suspense>
            </MainLayout>
            <Redirect to="/" />
          </Switch>
        </GAListener>
      </BrowserRouter>

    </Fragment>
  )
}

const query = ({ width }) => {
  if (width < 575) {
    return { breakpoint: 'xs' };
  }

  if (576 < width && width < 767) {
    return { breakpoint: 'sm' };
  }

  if (768 < width && width < 991) {
    return { breakpoint: 'md' };
  }

  if (992 < width && width < 1199) {
    return { breakpoint: 'lg' };
  }

  if (width > 1200) {
    return { breakpoint: 'xl' };
  }

  return { breakpoint: 'xs' };
};

// export default App;
export default componentQueries(query)(App);
