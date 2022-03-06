import { AuthContext } from "../../context/AuthContext"
import { useRouter } from "next/router"
import { useContext, useEffect } from "react"

const AuthGuard: React.FC = ({ children }) => {
  const { user, initializing } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    if (!initializing) {
      //auth is initialized and there is no user
      if (user === null) {
        router.push("/login")
      }
    }
  }, [initializing, router, user])

  /* show loading indicator while the auth provider is still initializing */


  // if auth initialized with a valid user show protected page
  if (!initializing && user !== null) {
    return <>{children}</>
  }

  /* otherwise don't return anything, will do a redirect from useEffect */
  return <h1>Application Loading</h1>

}

export { AuthGuard }