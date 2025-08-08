import { useRouteError } from "react-router-dom";
import LinkButton from "./LinkButton";

function Error({ message }) {
  const error = useRouteError();
  if (message) {
    return (
      <div>
        <p className="text-red-600 m-4">{message}</p>
        <LinkButton to="-1">&larr; Go back</LinkButton>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-red-500 m-4">Something went wrong 😢</h1>
      <p className="text-red-600 m-4">{error.data || error.message}</p>

      <LinkButton to="-1">&larr; Go back</LinkButton>
    </div>
  );
}

export default Error;
