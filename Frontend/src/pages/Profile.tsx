import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../redux/store";
import { toast } from "react-toastify";

interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
}

interface Listing {
  _id: string;
  name: string;
  imageUrls: string[];
}

export default function Profile() {
  const fileRef = useRef<HTMLInputElement>(null);
  const { currentUser, loading } = useSelector(
    (state: RootState) => state.user
  );
  console.log(currentUser, "currentUser");

  const [file, setFile] = useState<File | undefined>(undefined);
  const [filePerc, setFilePerc] = useState<number>(0);
  const [fileUploadError, setFileUploadError] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const [showListingsError, setShowListingsError] = useState<boolean>(false);
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file: File) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      () => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData((prevData) => ({ ...prevData, avatar: downloadURL }))
        );
      }
    );
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!currentUser) return;
      dispatch(updateUserStart());
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        dispatch(updateUserFailure(error.message));
        toast.error(error.message, {
          position: "bottom-right",
          theme: "colored",
        });
      } else {
        console.log(error);
      }
    }
  };

  const handleDeleteUser = async () => {
    try {
      if (!currentUser) return;
      dispatch(deleteUserStart());
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      toast.success("Account deleted successfully", {
        position: "bottom-right",
        theme: "colored",
      });
      navigate("/sign-in");
    } catch (error: unknown) {
      if (error instanceof Error) {
        dispatch(deleteUserFailure(error.message));
        toast.error(error.message, {
          position: "bottom-right",
          theme: "colored",
        });
      } else {
        console.log(error);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/signout`,{
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      toast.success("Signed out successfully", {
        position: "bottom-right",
        theme: "colored",
      });
      navigate("/sign-in");
    } catch (error: unknown) {
      if (error instanceof Error) {
        dispatch(deleteUserFailure(error.message));
        toast.error(error.message, {
          position: "bottom-right",
          theme: "colored",
        });
      } else {
        console.log(error);
      }
    }
  };

  const handleShowListings = async () => {
    console.log("inside func");
    console.log(currentUser, "currentUser");
    
    try {
      if (!currentUser) return;
      setShowListingsError(false);
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/listings/${currentUser._id}`,{
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        toast.error(data.message || 'Failed to fetch listings', {
          position: "bottom-right",
          theme: "colored",
        });
        setShowListingsError(true);
        return;
      }
      console.log(data, "data");
  
      setUserListings(data.listings);
    } catch (error) {
      toast.error("Failed to fetch listings", {
        position: "bottom-right",
        theme: "colored",
      });
      setShowListingsError(true);
    }
  };
  

  const handleListingDelete = async (listingId: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/listing/delete/${listingId}`,
        {
          method: "DELETE",
        credentials: "include",
        }
      );
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
      // toast.success(data.)
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message, {
          position: "bottom-right",
          theme: "colored",
        });
      } else {
        console.log(error);
      }
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files?.[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current?.click()}
          src={formData.avatar || currentUser?.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser?.username}
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          defaultValue={currentUser?.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          onChange={handleChange}
          id="password"
          className="border p-3 rounded-lg"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>

      {/* <p className="text-red-700 mt-5">{error ? error : ""}</p> */}
      <p className="text-green-700 my-5">
        {updateSuccess ? "User is updated successfully!" : ""}
      </p>
      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}
      </p>

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col item-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
