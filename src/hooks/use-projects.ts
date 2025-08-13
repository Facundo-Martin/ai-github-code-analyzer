import { api } from "~/trpc/react";
import { useLocalStorage } from "usehooks-ts";

export const useProjects = () => {
  const { data: projects } = api.project.getAll.useQuery();
  const [selectedProjectId, setSelectedProjectId] = useLocalStorage(
    "project-id",
    "",
  );
  const selectedProject = projects?.find((x) => x.id === selectedProjectId);

  return { projects, selectedProject, selectedProjectId, setSelectedProjectId };
};
