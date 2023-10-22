"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function EditProjectPage({ params }) {
  const [scenes, setScenes] = useState();
  const [initailization, setInitailization] = useState(false);
  const { data: session } = useSession();
  const Id = params.projectId;
  console.log(Id);

  // get the project data first
  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: ["animation"],
    queryFn: async () => {
      const response = await axios.get(`/api/projects/${Id}`);
      return response.data;
    },
  });

  console.log(project);

  //check if this the project owner
  // update to include collaborators later
  const projectOwner = project?.owner === session?.user.email;

  //check if the jsonData field in the project is empty. If it it, it means the project is just being created newly,
  //so go ahead and get the animation data for this new project

  const { mutate: updateProject, isLoading: isLoadingUpdateProject } =
    useMutation({
      mutationFn: async () => {
        const animationString = JSON.stringify(animation);
        console.log(animationString);

        // Use the PATCH method to update the project
        const response = await axios.patch(`/api/projects/${Id}`, {
          jsonData: animationString,
        });

        return response.data;
      },
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data) => {
        console.log(data);
        setInitailization(false);
      },
    });

  const { mutate: animationData, isLoading: isLoadingAnimationData } =
    useMutation({
      mutationFn: async (id) => {
        return axios.get(`/api/animation/${project?.template}`);
      },
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data) => {
        console.log(data);
        const jsonObject = JSON.parse(data.data.jsonData);
        setScenes(jsonObject);
        // updateProject();
      },
    });

  // make api call to get animation
  useEffect(() => {
    if (projectOwner) {
      if (!project) {
        // Wait for project data to be available
        return;
      }

      if (!project.jsonData) {
        console.log("animation isn't included yet");
        // If jsonData is not available, fetch animation data
        animationData(Number(Id));
        setInitailization(true);
      } else {
        console.log("Animation has been included already");
        const jsonObject = JSON.parse(project.jsonData);
        setScenes(jsonObject);
      }
    }
  }, [projectOwner, project]);

  // get use animation data we just requested to update the project jsonData field in the database
  useEffect(() => {
    // Check if animation data is available
    if (scenes && initailization) {
      updateProject();
    }
  }, [scenes]);

  return (
    <>
      {projectOwner ? (
        <div>
          <>Edit</>
          {isLoadingProject ? <p>Loading...</p> : <p>Ready</p>}
        </div>
      ) : (
        <section>
          <p>You do not have access to edit this project.</p>
        </section>
      )}
    </>
  );
}

export default EditProjectPage;
