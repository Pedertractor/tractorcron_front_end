import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router';

import { AppSidebar } from '@/components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

function SidebarNavigationCloser() {
  const { pathname } = useLocation();
  const { setOpen, setOpenMobile } = useSidebar();

  useEffect(() => {
    setOpenMobile(false);
    setOpen(false);
  }, [pathname, setOpen, setOpenMobile]);

  return null;
}

const SideBar = () => {
  const path = useLocation();
  const [listOfPathName, setListOfPathName] = useState<string[]>([]);
  const [atualPath, setAtualPath] = useState<string>('');

  useEffect(() => {
    const arrayPath = path.pathname.split('/');
    const removeFirstPath = arrayPath.filter((item) => item !== '');
    setListOfPathName(removeFirstPath);
    setAtualPath(arrayPath[arrayPath.length - 1]);
  }, [path.pathname]);

  return (
    <SidebarProvider defaultOpen={false}>
      <SidebarNavigationCloser />
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 border-b border-border bg-white px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
          <div className='flex items-center gap-2'>
            <SidebarTrigger className='-ml-1' />
            <Separator
              orientation='vertical'
              className='mr-2 data-[orientation=vertical]:h-4'
            />
            <Breadcrumb>
              <BreadcrumbList>
                {listOfPathName.map((itemPath, index) => {
                  const isLast = itemPath === atualPath;

                  return (
                    <span key={`${itemPath}-${index}`} className='contents'>
                      {index > 0 && (
                        <BreadcrumbSeparator className='hidden md:block' />
                      )}
                      <BreadcrumbItem className={index === 0 ? 'hidden md:block' : undefined}>
                        {isLast ? (
                          <BreadcrumbPage>{itemPath}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link to={`/${itemPath}`}>{itemPath}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </span>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className='flex flex-1 flex-col px-2 py-3 sm:px-4 sm:py-4'>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SideBar;
