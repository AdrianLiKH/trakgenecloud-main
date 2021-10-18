import React, {Suspense} from 'react'
import { Redirect, Route, Switch, useHistory} from "react-router-dom"
import AdminLogin from 'src/components/dashboard/Adminlogin'
import { APICONSTANTS, CONSTANTS } from 'src/components/Constants'
import axios from 'src/axios'
import BackdropLoader from 'src/components/UI/loader/BackdropLoader'
import SnackBar from 'src/components/UI/snack/SnackBar'
import {UserContext, LoadingContext, SnackContext} from 'src/store/ContextStore'

// lazy loading for app and admin modules
const AdminPanel = React.lazy(() => import('src/components/admin/AdminPanel'))
const UserForm = React.lazy(() => import('src/components/UserForm'))

const Dashboard = () => {
    const history = useHistory()

    const [user, setUser] = React.useState(null)
    const userProviderValue = React.useMemo(() => ({user, setUser}), [user, setUser])

    const [snack, setSnack] = React.useState({status: false, msg: '', severity: ''})
    const snackProviderValue = React.useMemo(() => ({snack, setSnack}), [snack, setSnack])

    const [loading, setLoading] = React.useState(true)
    const loadingProviderValue = React.useMemo(() => ({loading, setLoading}), [loading, setLoading])

    const ignoreTokenPaths = [
        CONSTANTS.signinPath,
        CONSTANTS.userformPath
    ]

    React.useEffect(() => {
        // function to verify if logged user has a valid token
        if (!user && !ignoreTokenPaths.includes(window.location.pathname)) {
            axios.get(APICONSTANTS.loginverify)
            .then(res => {
                setUser({...res.data})
                setLoading(false)
            })
            .catch(err => {
                history.push(CONSTANTS.signinPath)
                setLoading(false)
            })
        }
        else setLoading(false)
    }, [])

    return (
        <UserContext.Provider value={userProviderValue}>
            <LoadingContext.Provider value={loadingProviderValue}>
                <SnackContext.Provider value={snackProviderValue}>
                    <Switch>
                        <Route path={CONSTANTS.userformPath}>
                            <Suspense fallback={<BackdropLoader loading={true}> </BackdropLoader>}>
                                <UserForm/>
                            </Suspense>
                            
                        </Route>

                        <Route path={CONSTANTS.signinPath}>
                            <AdminLogin/>
                        </Route>

                        <Route path={CONSTANTS.adminPath}>
                            {user && user.email && (
                                <Suspense fallback={<BackdropLoader loading={true}> </BackdropLoader>}>
                                    <AdminPanel
                                        email = {user.email}
                                        userType = {user.userType}
                                    />
                                </Suspense>
                            )}
                        </Route>

                        {user && user.email && <Redirect to={CONSTANTS.adminPath} />}
                        
                    </Switch>

                    <SnackBar
                        open={snack.status}
                        message={snack.msg}
                        severity={snack.severity}
                        setOpen={() => setSnack({...snack, status: false})}
                    />
                    <BackdropLoader loading={loading}> </BackdropLoader>
                </SnackContext.Provider>
            </LoadingContext.Provider>
        </UserContext.Provider>
    )
}

export default Dashboard
