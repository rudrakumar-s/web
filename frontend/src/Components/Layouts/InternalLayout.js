import React from "react";
import UserContext from "../../Hooks/UserContext";
import Loading from "./Loading";

// The InternalLayout component is responsible for conditionally rendering different components
// based on the user type (student or other roles).
const InternalLayout = () => {
  const InternalResultForm = React.lazy(() =>
    // Lazy loading components for performance optimization.
    // These components are loaded only when they are needed.
    import("../Forms/InternalResultForm")
  );
  const InternalStudent = React.lazy(() =>
    import("../Queries/InternalStudent")
  );

  // Accessing the user context to determine the user type.
  const { user } = React.useContext(UserContext);
  return (
    <>
      {user.userType === "student" ? (
        <React.Suspense fallback={<Loading />}>
          <InternalStudent />
        </React.Suspense>
      ) : (
        <React.Suspense fallback={<Loading />}>
          <InternalResultForm />
        </React.Suspense>
      )}
    </>
  );
};

export default InternalLayout;
