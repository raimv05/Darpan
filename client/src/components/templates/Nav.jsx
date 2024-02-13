import React, { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { update } from "../../Function/User";
import Loading from "./Loading";

function Nav({ type }) {
  const [menu, setMenu] = useState(false);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.user);

  const menuRef = useRef(null);

  let auther = async () => {
    const response = await fetch("/api/authenticate", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    let res = await response.json();
    dispatch(update({ ...res, loading: false }));
  };

  useEffect(() => {
    auther();
  }, []);

  useEffect(() => {
    // Toggle body overflow based on loading state
    document.body.style.overflowY = data.loading ? "hidden" : "auto";

    // Cleanup to reset the style when the component unmounts
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [data.loading]);

  const handleClickOutsideMenu = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      // Clicked outside the menu, close it
      setMenu(false);
    }
  };

  useEffect(() => {
    // Add click event listener to close menu when clicked outside
    document.addEventListener("mousedown", handleClickOutsideMenu);

    // Cleanup to remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMenu);
    };
  }, []);

  let logout = async () => {
    dispatch(update({ ...data, loading: true }));
    const response = await fetch("/api/logout", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    window.location.replace("/");
  };

  return (
    <>
      <header className="header" data-header>
        <div className="container">
          <NavLink to="/" className="logo">
            <h2>Darpan Analytics</h2>
          </NavLink>
          {/* <NavLink to="/" className="">
            <h2>Psycometric Test</h2>
          </NavLink> */}
         
          <nav className="navbar" data-navbar>
            {type === "login" || type === "signup" ? (
              ""
            ) : (
              <>
                <div className="wrapper">
                  <button
                    className="nav-close-btn"
                    aria-label="close menu"
                    data-nav-toggler
                  >
                    <ion-icon
                      name="close-outline"
                      aria-hidden="true"
                    ></ion-icon>
                  </button>
                </div>

                <ul className="navbar-list"></ul>
              </>
            )}
          </nav>

          <div className="header-actions">
            {type === "login" || type === "signup" ? (
              ""
            ) : (
              <>
                {data.email ? (
                  <>
                    <button
                      className="header-action-btn"
                      aria-label="cart"
                      title="Cart"
                      onClick={() => setMenu(!menu)}
                    >
                      <ion-icon name="person-circle"></ion-icon>
                    </button>
                    <div className={menu ? "menu active" : "menu"} ref={menuRef}>
                      <ul>
                        <li>
                          <NavLink
                            to="/profile"
                            onClick={() => {
                              setMenu(false);
                            }}
                          >
                            <ion-icon name="person"></ion-icon>&nbsp;Profile
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/newtest"
                            onClick={() => {
                              setMenu(false);
                            }}
                          >
                            <ion-icon name="clipboard"></ion-icon>&nbsp;New Test
                          </NavLink>
                        </li>
                        <li>
                          <a onClick={logout}>
                            <ion-icon name="log-out-sharp"></ion-icon>&nbsp;Sign Out
                          </a>
                        </li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <NavLink to="/login" className="btn has-before">
                    <a className="btn has-before">
                      <span className="span">Login</span>

                      <ion-icon
                        name="arrow-forward-outline"
                        aria-hidden="true"
                      ></ion-icon>
                    </a>
                  </NavLink>
                )}
              </>
            )}
          </div>

          <div className="overlay" data-nav-toggler data-overlay></div>
        </div>
      </header>
      {data.loading ? <Loading /> : ""}
    </>
  );
}

export default Nav;
