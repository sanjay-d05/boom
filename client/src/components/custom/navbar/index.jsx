import { Authcontext } from '@/context/AuthContext';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { TbLogout } from 'react-icons/tb';
import { IoMdAddCircle } from 'react-icons/io';
import { jwtDecode } from 'jwt-decode';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

import logo from '../../../../public/boom.png' ;

const MAX_SIZE_MB = 10;

function Header() {
  const {
    accessToken,
    logout,
    loginCredentials,
    setLoginCredentials,
    videoType,
    setVideoType,
    uploadata,
    setUploadData,
  } = useContext(Authcontext);

  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);
        setLoginCredentials({
          username: decodedToken.username,
          userid : decodedToken.userid ,
          email: decodedToken.email,
          currentUserId : decodedToken.id ,
          wallet : decodedToken.wallet ,
          purchasevideos : decodedToken.purchaseVideo
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [accessToken]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileSizeMB = selectedFile.size / (1024 * 1024);
      if (fileSizeMB > MAX_SIZE_MB) {
        setError("File size should be less than 10MB");
        setFile(null);
      } else {
        setError("");
        setFile(selectedFile);
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!uploadata.title.trim() || !uploadata.description.trim()) {
      setError("Title and Description are required.");
      setIsSubmitting(false);
      return;
    }

    if (!videoType) {
      setError("Please select a video type.");
      setIsSubmitting(false);
      return;
    }

    let payload = {
      title: uploadata.title,
      description: uploadata.description,
      videoType,
      uploadedBy: loginCredentials.userid,
    };

    if (videoType === 'short-form') {
      if (!file) {
        setError("Please select a video file.");
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("cloud_name", CLOUD_NAME);
      formData.append("resource_type", "video");

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!data.secure_url) {
          setError("Cloudinary upload failed.");
          setIsSubmitting(false);
          return;
        }

        payload.shortFormUrl = data.secure_url;
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        setError("Upload to Cloudinary failed.");
        setIsSubmitting(false);
        return;
      }
    } else if (videoType === 'long-form') {
      if (!uploadata.longFormUrl.trim()) {
        setError("Long-form video URL is required.");
        setIsSubmitting(false);
        return;
      }

      if (!uploadata.longFormPricing || isNaN(Number(uploadata.longFormPricing))) {
      setError("Pricing is required and must be a valid number.");
      setIsSubmitting(false);
      return;
  }

      payload.longFormUrl = uploadata.longFormUrl;
      payload.longFormPricing = uploadata.longFormPricing;
    }

    try {
      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Something went wrong during video save.");
        setIsSubmitting(false);
        return;
      }

      toast.success("Video uploaded and saved successfully!");
      setUploadData({
        title: '',
        description: '',
        longFormUrl: '',
        longFormPricing: '',
        shortFormUrl: '',
      });
      setFile(null);
      setVideoType("");
      setError("");
    } catch (err) {
      console.error("Backend save error:", err);
      setError("Failed to save video metadata.");
    }

    setIsSubmitting(false);
  };

  const isShortFormValid = () =>
    uploadata.title.trim() &&
    uploadata.description.trim() &&
    videoType === 'short-form' &&
    file;

  const isLongFormValid = () =>
    uploadata.title.trim() &&
    uploadata.description.trim() &&
    videoType === 'long-form' &&
    uploadata.longFormUrl.trim();

  const isFormValid = isShortFormValid() || isLongFormValid();
  

  return (
    <header style={{ position: 'fixed', top: '0', zIndex: 50 }} className="flex justify-between items-center border-b px-2 sm:px-4 py-2 sm:py-2 w-full bg-[#e5e7eb] shadow">
      <Link to={'/home'} className="font-extrabold text-xl">
        <span className='font-serif '>
          <img className='w-10' src={logo} alt="" />
        </span>
      </Link>

      {accessToken ? (
        <div className="flex justify-center items-center gap-1">
          <Dialog>
            <DialogTrigger>
              <IoMdAddCircle size={35} />
            </DialogTrigger>
            <DialogContent className='h-full lg:h-fit overflow-auto'>
              <DialogHeader>
                <DialogTitle>Upload Video!</DialogTitle>
                <DialogDescription>Select the Video Type to start.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpload}>

                <div className="mb-3 flex flex-col gap-1">
                  <Label className='font-serif text-xl'>UserID</Label>
                  <Input
                    type="text"
                    value={loginCredentials.userid}
                    disabled
                  />
                </div>

                <div className="mb-3 flex flex-col gap-1">
                  <Label className='font-serif text-xl'>Title</Label>
                  <Input
                    type="text"
                    placeholder="Title here..."
                    value={uploadata.title}
                    onChange={(e) => setUploadData({ ...uploadata, title: e.target.value })}
                  />
                </div>

                <div className="mb-3 flex flex-col gap-1">
                  <Label className='font-serif text-xl'>Description</Label>
                  <Textarea
                    placeholder="Type your message here."
                    value={uploadata.description}
                    onChange={(e) => setUploadData({ ...uploadata, description: e.target.value })}
                  />
                </div>

                <div className="mb-3 flex flex-col gap-1">
                  <Select onValueChange={(value) => setVideoType(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Video Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select Video Type</SelectLabel>
                        <SelectItem value="short-form">Short-Form</SelectItem>
                        <SelectItem value="long-form">Long-Form</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {videoType === 'short-form' && (
                  <div className="mb-3 flex flex-col gap-1">
                    <Label className='font-serif text-xl'>Choose file</Label>
                    <Input
                      type="file"
                      accept=".mp4"
                      onChange={handleFileChange}
                    />
                    {error ? (
                      <p className="text-red-500 text-sm mt-1">{error}</p>
                    ) : (
                      <p className="text-yellow-500 text-sm mt-1">File size should be 10MB or less</p>
                    )}
                  </div>
                )}

                {videoType === 'long-form' && (
                  <div className="mb-3 flex flex-col gap-1">
                    <div className="w-full mb-3">
                      <Label className='font-serif text-xl'>Link</Label>
                      <Input
                        type="url"
                        placeholder="https://example.com"
                        value={uploadata.longFormUrl}
                        onChange={(e) => setUploadData({ ...uploadata, longFormUrl: e.target.value })}
                      />
                    </div>
                    <div className="w-full">
                      <Label className='font-serif text-xl'>Price (in ₹)</Label>
                      <Input
                        type="number"
                        placeholder="₹0 for free or a price like ₹29 if paid"
                        value={uploadata.longFormPricing}
                        onChange={(e) => setUploadData({ ...uploadata, longFormPricing: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                <div className="text-center mt-4">
                  <Button disabled={!isFormValid || isSubmitting}>
                    {isSubmitting ? "Uploading..." : "Upload"}
                  </Button>
                </div>

                {error && <p className="text-red-500 text-center mt-2">{error}</p>}
              </form>
            </DialogContent>
          </Dialog>

          <Menubar className='border-none shadow-none'>
            <MenubarMenu>
              <MenubarTrigger>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  Hello, <span className='text-lg font-serif ml-1'>{loginCredentials.username}</span>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>
                  Email : <span className='font-serif ml-1'>{loginCredentials.email}</span>
                </MenubarItem>
                <MenubarItem>
                  ID : <span className='font-serif ml-1'>{loginCredentials.userid}</span>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem className='flex flex-col justify-center items-start'>
                  <p>
                    Wallet
                  </p>
                  <p>
                    Balance : <span>₹ {loginCredentials.wallet}</span>
                  </p>
                  <Button>
                    Add to Wallet
                  </Button>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem inset>Settings</MenubarItem>
                <MenubarSeparator />
                <div className='flex justify-end items-center'>
                  <TbLogout onClick={() => logout()} color='red' size={30} />
                </div>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      ) : null}
    </header>
  );
}

export default Header;
