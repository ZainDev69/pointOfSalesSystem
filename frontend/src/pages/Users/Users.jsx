import { useEffect } from "react";
import Table from "../../components/UI/Table";
import { useDispatch, useSelector } from "react-redux";
import { userList } from "../../components/redux/slice/users";
import Loader from "../../components/UI/Loader";
import Error from "../../components/UI/Error";

export default function UserPage() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.users);
  const headers = ["firstName", "Email", "Status", "Role"];
  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);

  useEffect(() => {
    dispatch(userList());
  }, [dispatch]);

  return (
    <>
      <div>
        {loading ? (
          <Loader />
        ) : error ? (
          <Error message={error.message} />
        ) : userData.length === 0 ? (
          <Error message="No user found" />
        ) : (
          <Table tagLine="Our Team" headers={headers} users={userData} />
        )}
      </div>
    </>
  );
}
