import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getCurrentUser, loginUser, registerUser } from "../services/api"
import useRouteMetadata from "../hooks/useRouteMetadata"
import { routeDescriptions } from "../data/catalog"

export default function Account() {
  const [mode, setMode] = useState("login")
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  useRouteMetadata({
    title: "AURA | Account",
    description: routeDescriptions.account,
  })

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      return
    }

    getCurrentUser()
      .then((response) => setUser(response.data))
      .catch(() => {
        localStorage.removeItem("token")
      })
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const payload = mode === "signup" ? form : { email: form.email, password: form.password }
      const response = mode === "signup" ? await registerUser(payload) : await loginUser(payload)

      localStorage.setItem("token", response.data.token)
      setUser(response.data.user)
      setMessage(response.data.message)
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setMessage("Signed out")
  }

  return (
    <section className="page-shell account-page">
      <header className="editorial-hero">
        <p className="eyebrow">Account</p>
        <h1 className="section-title">Saved shades, recent orders, and preferences.</h1>
        <p className="soft-copy">Sign in when you want to revisit your archive.</p>
      </header>

      {user ? (
        <div className="account-panel">
          <h2>Welcome back, {user.name}</h2>
          <p>{user.email}</p>
          <div className="account-actions">
            <button type="button" className="nav-bag" onClick={handleLogout}>
              Logout
            </button>
            <Link className="nav-account" to="/bag">
              Go to bag
            </Link>
          </div>
        </div>
      ) : (
        <div className="auth-layout">
          <div className="auth-switch">
            <button type="button" className={mode === "login" ? "filter-chip active" : "filter-chip"} onClick={() => setMode("login")}>Sign in</button>
            <button type="button" className={mode === "signup" ? "filter-chip active" : "filter-chip"} onClick={() => setMode("signup")}>Create account</button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <label>
                Name
                <input name="name" value={form.name} onChange={handleChange} />
              </label>
            )}

            <label>
              Email
              <input type="email" name="email" value={form.email} onChange={handleChange} />
            </label>

            <label>
              Password
              <input type="password" name="password" value={form.password} onChange={handleChange} />
            </label>

            <button type="submit" className="nav-bag" disabled={loading}>
              {loading ? "Please wait..." : mode === "signup" ? "Sign up" : "Sign in"}
            </button>

            {message && <p className="auth-message">{message}</p>}
          </form>
        </div>
      )}

      <Link className="filter-chip active" to="/journal">
        Visit the journal
      </Link>
    </section>
  )
}