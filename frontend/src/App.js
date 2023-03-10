import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import DetailSpot from "./components/DetailSpot";
import CreateSpot from "./components/CreateSpot";
import UpdateSpot from "./components/UpdateSpot";
import DeleteReview from "./components/DeleteReview";
import ManageSpot from "./components/ManageSpot";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path='/spot/:id/reviews'><DeleteReview /> </Route>
          <Route exact path='/spot/:id'> <DetailSpot /> </Route>
          <Route exact path='/spots/current'><ManageSpot /></Route>
          <Route exact path='/spots'> <CreateSpot /> </Route>
          <Route exact path='/'><LandingPage /> </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
