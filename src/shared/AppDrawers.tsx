import React from "react";
import useQueryParams from "@/shared/hooks/useQueryParams";

interface DrawerProps {
  searchParams: Record<string, string>;
  destroyOnClose?: boolean;
  afterOpenChange?: (isOpen: boolean) => void;
}

interface DrawerComponentType {
  requiredParams?: Record<string, ((value: string) => boolean) | any>;
  closeParams?: string[];
  (props: DrawerProps): JSX.Element;
}

interface DrawersProps {
  drawerComponents: DrawerComponentType[];
}

const AppDrawers: React.FC<DrawersProps> = ({ drawerComponents }) => {
  const params = useQueryParams();

  return (
    <>
      {drawerComponents.map((DrawerComponent, ind) => {
        const open = shouldRenderDrawer(DrawerComponent, params.searchParams);
        if (!open) return null;

        const props: DrawerProps = {
          searchParams: params.searchParams,
          destroyOnClose: true,
          afterOpenChange: (isOpen: boolean) => {
            if (!isOpen) {
              params.removeParams([
                ...Object.keys(DrawerComponent.requiredParams ?? {}),
                ...(DrawerComponent.closeParams ?? []),
              ]);
            }
          },
        };

        return <DrawerComponent key={ind} {...props} />;
      })}
    </>
  );
};

const shouldRenderDrawer = (
  drawer: DrawerComponentType,
  searchParams: Record<string, string>,
) => {
  if (!drawer.requiredParams || Object.keys(drawer.requiredParams).length === 0)
    return false;
  if (Object.keys(searchParams).length === 0) return false;

  return Object.entries(drawer.requiredParams).every(([param, check]) => {
    if (typeof check !== "function") {
      return Boolean(searchParams[param]);
    } else {
      return check(searchParams[param]);
    }
  });
};

export default AppDrawers;
