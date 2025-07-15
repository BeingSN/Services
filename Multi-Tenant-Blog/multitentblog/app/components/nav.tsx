"use client";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import * as React from "react";

const Nav: React.FC = () => {
  return (
    <>
      <nav className=" p-4 flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl">Blog Application</h1>
        </div>
        <div className="flex gap-2 justify-center items-center">
          <OrganizationSwitcher afterSelectOrganizationUrl="/org/:slug" />
          <UserButton />
        </div>
      </nav>
    </>
  );
};

export default Nav;
