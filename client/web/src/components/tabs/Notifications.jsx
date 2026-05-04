import { IoMdClose } from "react-icons/io";
import axiosInstance from "../../utils/axios";
import { useEffect, useState } from "react";
import ImageWithShimmer from "../ImageShimmer";
import { BsPatchCheckFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Notifications = ({ close }) => {
  const [requests, setRequests] = useState([]);
  const fetchData = async () => {
    try {
      const { data } = await axiosInstance.get(`/users/followersRequest`);
      data.success && setRequests(data.requests);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleConfirmRequest = async (requestId) => {
    console.log(requestId)
    try {
      const { data } = await axiosInstance.post(
        `/users/request/${requestId}/accept`,
      );
      data.success && toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <article className="py-8 px-4 relative">
      <h1 className="text-2xl font-semibold">Notifications</h1>
      <div>
        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          <button className="hover:bg-foreground/10 px-3 rounded-full border-ring border text-sm py-1 cursor-pointer transition-colors">
            All
          </button>
          <button className="hover:bg-foreground/10 px-3 rounded-full border-ring border text-sm py-1 cursor-pointer transition-colors">
            Request
          </button>
          <button className="hover:bg-foreground/10 px-3 rounded-full border-ring border text-sm py-1 cursor-pointer transition-colors">
            Message
          </button>
        </div>
        <div className="py-2">
          {requests.map((request) => {
            return (
              <div
                key={request.id}
                className="p-2 rounded hover:bg-foreground/10 cursor-pointer flex items-start gap-2 w-full"
              >
                <Link
                  className="relative"
                  to={`/${request.senderId.username}`}
                  state={{ request }}
                >
                  <div className="h-12 w-12 overflow-hidden rounded-full border border-foreground/50">
                    <ImageWithShimmer src={request?.senderId?.avatar} />
                  </div>
                  {request?.senderId?.isBlueTick && (
                    <BsPatchCheckFill
                      className="text-blue-500 absolute -right-1 -top-1 z-999 "
                      size={20}
                      title="verified"
                    />
                  )}
                </Link>
                <div className="flex  items-center justify-between w-full">
                  <div>
                    <span>{request?.senderId?.username}</span>
                    <p className="text-sm">{request?.senderId?.name}</p>
                  </div>
                  <div className="flex items-center justify-center  gap-2">
                    <button
                      className="border dark:border-green-700 py-1 px-2 rounded-full hover:cursor-pointer dark:hover:bg-green-900/50"
                      onClick={() => handleConfirmRequest(request.id)}
                    >
                      Confirm
                    </button>
                    <button className="border dark:border-red-700 py-1 px-2 rounded-full hover:cursor-pointer dark:hover:bg-red-900/50">
                      Deine
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Close */}
      <button onClick={close} className="absolute top-4 right-4 cursor-pointer">
        <IoMdClose size={28} />
      </button>
    </article>
  );
};

export default Notifications;
