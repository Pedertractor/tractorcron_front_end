import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import Icon from './icon';
import menuIcon from '../../assets/icons/menu-icon.svg?react';
import addClockIcon from '../../assets/icons/plus-clock-icon.svg?react';
import dashBoardIcon from '../../assets/icons/graph-icon.svg?react';

import Text from './text';
import logoShort from '../../assets/logo/short-logo.svg?react';
import logoLittle from '../../assets/logo/icon-logo.svg?react';
import { useIsMobile } from '@/hooks/use-mobile';
import RandomIconUser from '../random-icon-user';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Cog, LogOut } from 'lucide-react';

const linksAndIcons = [
  {
    name: 'Nova Cronoanálise',
    icon: addClockIcon,
    to: '/cronoanalise',
    rolePermition: ['ADMIN', 'CHRONOANALIST'],
  },
  {
    name: 'Analisar Cronoanálise',
    icon: dashBoardIcon,
    to: '/relatorio',
    rolePermition: ['ADMIN', 'CHRONOANALIST'],
  },
];

const SideBar = () => {
  const [isOpen, setOpen] = useState(false);
  const [role] = useState(() => localStorage.getItem('role'));
  const [name] = useState(() => localStorage.getItem('name'));
  const [email] = useState(() => localStorage.getItem('email'));

  const [listOfPathName, setListOfPathName] = useState<[] | string[]>([]);
  const [atualPath, setAtualPath] = useState<string>('');

  const path = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    const arrayPath = path.pathname.split('/');
    const removeFirstPath = arrayPath.filter((item) => item !== '');
    setListOfPathName(removeFirstPath);
    setAtualPath(arrayPath[arrayPath.length - 1]);
  }, [path.pathname]);

  function logout() {
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('startTime');
    localStorage.removeItem('endTime');
    navigate('/login');
  }

  if (isMobile)
    return (
      <main className='flex w-full min-h-[100vh]'>
        {isOpen && (
          <div className='h-full w-full fixed z-10 top-0 left-0 flex'>
            <div className='w-[300px] h-full flex inset-0 bg-black/20 backdrop-blur-sm'>
              <div className='w-full h-full border-border border-r py-3 px-2 bg-white flex flex-col gap-5'>
                <Link to={'/'}>
                  <div className=' p-2 rounded-lg bg-background-base-blue flex items-center w-fit'>
                    <Icon svg={logoShort} className='w-[100px] h-[30px]' />
                  </div>
                </Link>
                <ul className='flex-col flex gap-1.5 w-full'>
                  {role &&
                    linksAndIcons
                      .filter((item) => item.rolePermition.includes(role))
                      .map((item, index) => (
                        <li
                          key={index}
                          className='flex items-center px-2 w-full transition hover:bg-border active:bg-border rounded-lg  py-0.5'
                        >
                          <Link
                            key={index}
                            to={item.to}
                            className=' w-full flex items-center  gap-1.5'
                          >
                            <Icon
                              svg={item.icon}
                              className='size-5 stroke-secondary'
                            />
                            <Text
                              variant={'little-text'}
                              className={`transition-opacity text-start duration-300 ease-in-out ${
                                isOpen
                                  ? 'opacity-100'
                                  : 'opacity-0 pointer-events-none absolute'
                              }`}
                            >
                              {item.name}
                            </Text>
                          </Link>
                        </li>
                      ))}
                </ul>
                <div className=' flex flex-col items-center justify-end h-full'>
                  <Popover>
                    <PopoverTrigger className=' w-full'>
                      <div className=' flex gap-1 w-full rounded-lg hover:bg-border p-2 cursor-pointer'>
                        <RandomIconUser name={name} />
                        <div className=' flex flex-col items-start'>
                          <p className=' text-sm font-bold text-initial'>
                            {name?.slice(0, 7)}.
                          </p>
                          <p className=' text-xs  text-secondary'>{email}</p>
                        </div>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className=' bg-white ml-[50%] border border-border shadow-sm text-sm w-fit p-1 rounded-lg flex flex-col gap-1'>
                      <button className=' hover:cursor-pointer hover:bg-zinc-100 active:bg-zinc-100 transition rounded-lg w-full py-1 flex items-center gap-2 text-sm px-2 '>
                        <Cog size={15} />
                        configurações
                      </button>
                      <button
                        onClick={logout}
                        className=' hover:cursor-pointer hover:bg-zinc-100 active:bg-zinc-100 transition rounded-lg w-full py-1 flex items-center gap-2 text-sm px-2 '
                      >
                        <LogOut size={15} />
                        sair
                      </button>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <button
                className='z-20 bg-white h-fit mt-1.5 ml-1 p-1.5 rounded flex items-center justify-center transition hover:cursor-pointer active:bg-border hover:bg-border'
                onClick={() => setOpen(!isOpen)}
              >
                <Icon svg={menuIcon} className='stroke-secondary' />
              </button>
            </div>
            <div
              className=' inset-0 bg-black/20 backdrop-blur-sm w-1/2 h-full '
              onClick={() => setOpen(!isOpen)}
            />
          </div>
        )}
        <section className={`h-screen flex w-full p-2`}>
          <nav className=' flex h-fit mr-2'>
            <button
              className=' bg-white p-1.5 rounded flex items-center justify-center transition hover:cursor-pointer active:bg-border hover:bg-border'
              onClick={() => setOpen(!isOpen)}
            >
              <Icon svg={menuIcon} className='stroke-secondary' />
            </button>
          </nav>
          <Outlet />
        </section>
      </main>
    );

  return (
    <main className='flex w-full min-h-[100vh]'>
      <div className={` w-full flex `}>
        {isOpen ? (
          <menu className='h-screen fixed top-0 left-0 z-10 border-border border-r bg-white py-3 px-2 flex flex-col gap-5 w-[300px]'>
            <Link to={'/'}>
              <div className=' p-2 py-1 rounded-lg bg-background-base-blue flex items-center w-fit'>
                <Icon svg={logoShort} className='w-[100px] h-[25px]' />
              </div>
            </Link>

            <ul className='flex-col flex gap-1.5 w-full'>
              {role &&
                linksAndIcons
                  .filter((item) => item.rolePermition.includes(role))
                  .map((item, index) => (
                    <li
                      key={index}
                      className='flex items-center px-2 w-full transition hover:bg-border active:bg-border rounded-lg  py-0.5'
                    >
                      <Link
                        key={index}
                        to={item.to}
                        className=' w-full flex items-center  gap-1.5'
                      >
                        <Icon
                          svg={item.icon}
                          className='size-5 stroke-secondary'
                        />
                        <Text
                          variant={'little-text'}
                          className={`transition-opacity text-start duration-300 ease-in-out ${
                            isOpen
                              ? 'opacity-100'
                              : 'opacity-0 pointer-events-none absolute'
                          }`}
                        >
                          {item.name}
                        </Text>
                      </Link>
                    </li>
                  ))}
            </ul>
            <div className=' flex flex-col items-center justify-end h-full'>
              <Popover>
                <PopoverTrigger className=' w-full'>
                  <div className=' flex gap-1 w-full rounded-lg hover:bg-border p-2 cursor-pointer'>
                    <RandomIconUser name={name} />
                    <div>
                      <p className=' text-sm font-bold text-initial'>
                        {name?.slice(0, 7)}.
                      </p>
                      <p className=' text-xs  text-secondary'>{email}</p>
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className=' bg-white ml-[50%] border border-border shadow-sm text-sm w-fit p-1 rounded-lg flex flex-col gap-1'>
                  <button className=' hover:cursor-pointer hover:bg-zinc-100 active:bg-zinc-100 transition rounded-lg w-full py-1 flex items-center gap-2 text-sm px-2 '>
                    <Cog size={15} />
                    configurações
                  </button>
                  <button
                    onClick={logout}
                    className=' hover:cursor-pointer hover:bg-zinc-100 active:bg-zinc-100 transition rounded-lg w-full py-1 flex items-center gap-2 text-sm px-2 '
                  >
                    <LogOut size={15} />
                    sair
                  </button>
                </PopoverContent>
              </Popover>
            </div>
          </menu>
        ) : (
          <menu className='h-screen fixed top-0 left-0 border-border border-r py-3 px-2  flex flex-col items-center gap-5'>
            <Link to={'/'}>
              <Icon svg={logoLittle} />
            </Link>
            <ul className='flex-col flex gap-1.5 w-full items-center'>
              {role &&
                linksAndIcons
                  .filter((item) => item.rolePermition.includes(role))
                  .map((item, index) => (
                    <Link key={index} to={item.to}>
                      <li className='flex items-center justify-center p-2 rounded-lg transition active:bg-border hover:bg-border'>
                        <Icon
                          svg={item.icon}
                          className='size-5 stroke-secondary'
                        />
                      </li>
                    </Link>
                  ))}
            </ul>
            <div className='h-full flex flex-col items-center justify-end'>
              <Popover>
                <PopoverTrigger>
                  <RandomIconUser name={name} />
                </PopoverTrigger>
                <PopoverContent className=' bg-white ml-2 border border-border shadow-sm text-sm w-fit p-1 rounded-lg flex flex-col gap-1'>
                  <button className=' hover:cursor-pointer hover:bg-zinc-100 active:bg-zinc-100 transition rounded-lg w-full py-1 flex items-center gap-2 text-sm px-2 '>
                    <Cog size={15} />
                    configurações
                  </button>
                  <button
                    onClick={logout}
                    className=' hover:cursor-pointer hover:bg-zinc-100 active:bg-zinc-100 transition rounded-lg w-full py-1 flex items-center gap-2 text-sm px-2 '
                  >
                    <LogOut size={15} />
                    sair
                  </button>
                </PopoverContent>
              </Popover>
            </div>
          </menu>
        )}
        <section
          className={` w-full flex flex-col px-4 py-2  ${
            isOpen ? 'ml-[300px]' : 'ml-13'
          }`}
        >
          <nav className=' w-full flex items-center mb-2'>
            <button
              className=' bg-white p-1.5 rounded flex items-center justify-center transition hover:cursor-pointer active:bg-border hover:bg-border'
              onClick={() => setOpen(!isOpen)}
            >
              <Icon svg={menuIcon} className='stroke-secondary' />
            </button>

            <ul className=' flex gap-2 ml-4'>
              {listOfPathName.map((itemPath, index) => (
                <li
                  key={index}
                  className={` ${
                    itemPath === atualPath
                      ? 'text-initial font-normal underline transition pointer-events-none'
                      : 'text-secondary font-light transition hover:underline'
                  }`}
                >
                  <Link to={`/${itemPath}`}>{itemPath}</Link>

                  {itemPath !== atualPath ? ' >' : null}
                </li>
              ))}
            </ul>
          </nav>
          <Outlet />
        </section>
      </div>
    </main>
  );
};

export default SideBar;
