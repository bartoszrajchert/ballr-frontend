import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import Tooltip from '@/components/Tooltip';
import VerifyEmailBanner from '@/components/VerifyEmailBanner';
import { ROUTES, QUERY_PARAMS } from '@/lib/routes';
import useGetAuth from '@/lib/useGetAuth';
import { UserContext } from '@/providers/UserProvider';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { IconAlertTriangleFilled } from '@tabler/icons-react';
import {
  IconChevronLeft,
  IconChevronRight,
  IconLogout,
  IconMenu2,
  IconX,
} from '@tabler/icons-react';
import clsx from 'clsx';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { useSignOut } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import { UrlObject } from 'url';
import logo from '../../public/logo.svg';

type Props = {
  focusMode?: boolean;
};

type LinkData = {
  label: string;
  desc: string;
  href: ROUTES;
};

type CategoryContent = {
  [key: string]: {
    title: string;
    links: LinkData[];
  };
};

/**
 * List of links for each category in navigation.
 */
const navigationContent: CategoryContent = {
  matches: {
    title: 'Mecze',
    links: [
      {
        label: 'Stwórz nowy mecz',
        desc: 'Zaproś znajomych i rozegrajcie mecz',
        href: ROUTES.MATCHES_NEW,
      },
      {
        label: 'Przeglądaj mecze',
        desc: 'Przeglądaj mecze i dołącz do nich',
        href: ROUTES.MATCHES,
      },
    ],
  },
  facilities: {
    title: 'Obiekty',
    links: [
      {
        label: 'Przeglądaj obiekty',
        desc: 'Przeglądaj mecze i dołącz do nich',
        href: ROUTES.FACILITIES,
      },
    ],
  },
  teams: {
    title: 'Drużyny',
    links: [
      {
        label: 'Stwórz nową drużynę',
        desc: 'Rozgrywaj mecze ze swoimi ulubionymi ludźmi i stówrz drużynę marzeń',
        href: ROUTES.TEAMS_NEW,
      },
      {
        label: 'Przeglądaj drużyny',
        desc: 'Dołącz do drużyny i graj mecze w zgranym zespole',
        href: ROUTES.TEAMS,
      },
    ],
  },
  testPages: {
    title: 'Test Pages',
    links: [
      {
        label: 'Protected Page',
        desc: 'Page that requires authentication',
        href: ROUTES.PROTECTED_PAGE,
      },
      {
        label: 'Requests Test Page',
        desc: 'Page that tests requests',
        href: ROUTES.REQUESTS_TEST_PAGE,
      },
    ],
  },
};

function Navigation({ focusMode }: Props) {
  return (
    <>
      <VerifyEmailBanner />
      <nav className="flex w-full py-4">
        <div className="flex w-full justify-between">
          <div className="flex h-[48px] w-[250px] items-center">
            <NextLink href={ROUTES.HOME}>
              <Image src={logo} alt="logo" height={22} />
            </NextLink>
          </div>
          {focusMode ? (
            <FocusModeButton />
          ) : (
            <div className="hidden w-full justify-between lg:flex">
              <NavigationMenuPrimitive.Root className="relative flex-grow">
                <NavigationMenuPrimitive.List className="flex flex-row justify-center space-x-2 rounded-lg p-2 text-label-medium">
                  {Object.keys(navigationContent).map((key) => (
                    <NavigationItemTrigger
                      key={key}
                      label={navigationContent[key].title}
                    >
                      <NavigationDetailedLinks
                        data={navigationContent[key].links}
                      />
                    </NavigationItemTrigger>
                  ))}

                  <NavigationMenuPrimitive.Indicator
                    className={clsx(
                      'z-10',
                      'top-[100%] flex h-2 items-end justify-center overflow-hidden',
                      'radix-state-visible:animate-fade-in',
                      'radix-state-hidden:animate-fade-out',
                      'transition-[width_transform] duration-[250ms] ease-[ease]'
                    )}
                  >
                    <div className="relative top-1 h-2 w-2 rotate-45 bg-grey-100" />
                  </NavigationMenuPrimitive.Indicator>
                </NavigationMenuPrimitive.List>
                <div
                  className={clsx(
                    'absolute flex justify-center',
                    'left-[-20%] top-[100%] w-[140%]'
                  )}
                >
                  <NavigationMenuPrimitive.Viewport
                    className={clsx(
                      'relative z-10 mt-2 overflow-hidden rounded-md bg-grey-100 shadow-lg',
                      'w-radix-navigation-menu-viewport',
                      'h-radix-navigation-menu-viewport',
                      'radix-state-open:animate-scale-in-content',
                      'radix-state-closed:animate-scale-out-content',
                      'origin-[top_center] transition-[width_height] duration-300 ease-[ease]'
                    )}
                  />
                </div>
              </NavigationMenuPrimitive.Root>
              <UserMenu />
            </div>
          )}
          <div className="flex items-center justify-center lg:hidden">
            <HamburgerMenu />
          </div>
        </div>
      </nav>
    </>
  );
}

/**
 * Hamburger menu component. It is used in mobile view.
 */
const HamburgerMenu = () => {
  const router = useRouter();
  const { firebaseUser: user } = useContext(UserContext);
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const [expandedContent, setExpandedContent] = useState<string | null>(null);

  useEffect(() => {
    const closeHamburgerMenu = () => setIsHamburgerMenuOpen(false);

    router.events.on('routeChangeComplete', closeHamburgerMenu);

    return () => {
      router.events.off('routeChangeComplete', closeHamburgerMenu);
    };
  }, [router.events]);

  useEffect(() => {
    if (isHamburgerMenuOpen) {
      window.scrollTo(0, 0);
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'unset';
    }

    setExpandedContent(null);
  }, [isHamburgerMenuOpen]);

  return (
    <div className="relative lg:hidden">
      {isHamburgerMenuOpen ? (
        <IconX onClick={() => setIsHamburgerMenuOpen(!isHamburgerMenuOpen)} />
      ) : (
        <IconMenu2
          onClick={() => setIsHamburgerMenuOpen(!isHamburgerMenuOpen)}
        />
      )}
      {isHamburgerMenuOpen && (
        <div
          className={clsx(
            'fixed bottom-0 left-0 right-0 z-10 flex flex-col justify-between overflow-y-scroll bg-white px-8 pb-8',
            {
              'top-[80px]': !user || user?.emailVerified,
              'top-[128px]': user && !user?.emailVerified,
            }
          )}
        >
          {!expandedContent ? (
            <ul className="flex flex-col gap-6">
              {Object.keys(navigationContent).map((key) => (
                <li
                  key={key}
                  className="flex cursor-pointer justify-between border-b border-b-grey-600 p-4 text-label-medium"
                  onClick={() => setExpandedContent(key)}
                >
                  {navigationContent[key].title}
                  <IconChevronRight />
                </li>
              ))}
            </ul>
          ) : (
            <div>
              <button
                onClick={() => setExpandedContent(null)}
                className="my-2 flex items-center justify-center gap-2 py-3 text-label-medium"
              >
                <IconChevronLeft size={16} />
                {navigationContent[expandedContent].title}
              </button>
              <ul className="flex flex-col gap-6">
                {navigationContent[expandedContent].links.map((item, index) => (
                  <NextLink href={item.href} key={index}>
                    <li className="border-b border-b-gray-500 p-4">
                      <p className="text-label-medium">{item.label} </p>
                      <p>{item.desc}</p>
                    </li>
                  </NextLink>
                ))}
              </ul>
            </div>
          )}
          <UserMenu />
        </div>
      )}
    </div>
  );
};

/**
 * User menu component.
 */
const UserMenu = () => {
  const router = useRouter();
  const auth = useGetAuth();
  const { user, error, firebaseUser } = useContext(UserContext);
  const [signOut, _, errorSignOut] = useSignOut(auth);

  useEffect(() => {
    if (errorSignOut) {
      toast.error(`Wystąpił błąd: ${errorSignOut.message}`);
    }
  }, [errorSignOut]);

  const signOutHandler = async () => {
    await signOut();
    await router.push(ROUTES.HOME);
    toast.success('Wylogowano pomyślnie');
  };

  return (
    <div className="flex justify-end lg:w-[250px]">
      {!firebaseUser && (
        <ul className="flex items-center gap-6 text-green-900 ">
          <Link
            href={{
              pathname: ROUTES.LOGIN,
              query: {
                [QUERY_PARAMS.REDIRECT]: router.asPath,
              },
            }}
          >
            Zaloguj się
          </Link>
          <li>
            <NextLink
              href={{
                pathname: ROUTES.REGISTER,
                query: {
                  [QUERY_PARAMS.REDIRECT]: router.asPath,
                },
              }}
            >
              <Button value="Rejestracja" type="primary" />
            </NextLink>
          </li>
        </ul>
      )}
      {error && (
        <div className="mr-2 flex items-center">
          <Tooltip
            delay={0}
            trigger={
              <Button
                icon={<IconAlertTriangleFilled className="text-red" />}
                type="tertiary"
                className="cursor-default"
              />
            }
          >
            <p className="max-w-[300px]">
              Błąd przy pobieraniu informacji o użytkowniku: {error.message}
            </p>
          </Tooltip>
        </div>
      )}
      {firebaseUser && (
        <div className="flex items-center gap-2">
          {user && (
            <NextLink href={`${ROUTES.PROFILE}/${user.id}`}>
              <Avatar text={`${user.first_name} ${user.last_name}`} clickable />
            </NextLink>
          )}
          <Button
            icon={<IconLogout />}
            onClick={signOutHandler}
            type="tertiary"
          />
        </div>
      )}
    </div>
  );
};

/**
 * Navigation menu component.
 * @param label - label of the menu item
 * @param children - children of the menu item, recommended to use NavigationDetailedLinks
 * @see NavigationDetailedLinks
 */
const NavigationItemTrigger = ({
  label,
  children,
}: {
  label: string;
  children: JSX.Element | JSX.Element[];
}) => {
  return (
    <NavigationMenuPrimitive.Item value={label}>
      <NavigationMenuPrimitive.Trigger className="rounded-md px-3 py-2 hover:bg-grey-200">
        {label}
      </NavigationMenuPrimitive.Trigger>

      <NavigationMenuPrimitive.Content
        className={clsx(
          'absolute left-0 top-0 w-auto rounded-lg',
          'radix-motion-from-start:animate-enter-from-left',
          'radix-motion-from-end:animate-enter-from-right',
          'radix-motion-to-start:animate-exit-to-left',
          'radix-motion-to-end:animate-exit-to-right'
        )}
      >
        {children}
      </NavigationMenuPrimitive.Content>
    </NavigationMenuPrimitive.Item>
  );
};

/**
 * Navigation menu component.
 * @param data - data of the links
 */
const NavigationDetailedLinks = ({ data }: { data: LinkData[] }) => {
  return (
    <div className="w-[16rem] p-3 lg:w-[28rem]">
      <div className="flex w-full flex-col space-y-2">
        {data.map((item, index) => (
          <NavigationMenuPrimitive.Link key={index} asChild>
            <NextLink
              key={index}
              className="w-full rounded-md px-4 py-3 hover:bg-gray-200"
              href={item.href}
            >
              <span className="text-label-medium">{item.label}</span>

              <div className="text-grey-70 text-p-small">{item.desc}</div>
            </NextLink>
          </NavigationMenuPrimitive.Link>
        ))}
      </div>
    </div>
  );
};

/**
 * Focus mode button component.
 */
const FocusModeButton = () => {
  const router = useRouter();
  const redirect =
    (router.query[QUERY_PARAMS.REDIRECT] as string) ?? ROUTES.HOME;
  const isCancelRedirect = router.query[QUERY_PARAMS.CANCEL_REDIRECT] as string;

  const { firebaseUser } = useContext(UserContext);
  const auth = useGetAuth();
  // TODO: handle error
  const [signOut] = useSignOut(auth);
  const signOutHandler = async () => {
    await signOut();
    await router.push(ROUTES.HOME);
    toast.success('Wylogowano pomyślnie');
  };

  return (
    <div className="hidden lg:flex lg:gap-2">
      {firebaseUser && (
        <Button
          icon={<IconLogout />}
          onClick={signOutHandler}
          type="tertiary"
        />
      )}
      <Button
        icon={<IconX />}
        onClick={() => router.push(isCancelRedirect ? ROUTES.HOME : redirect)}
        type="tertiary"
      />
    </div>
  );
};

/**
 * Link component.
 * @param href - href of the link
 * @param children - children of the link (text or JSX.Element)
 */
const Link = ({
  href,
  children,
}: {
  href: UrlObject;
  children: string | JSX.Element;
}) => {
  const router = useRouter();
  const isActive = router.asPath === href.pathname;

  return (
    <li>
      <NextLink
        className={clsx('link', {
          'before:bg-green-900': isActive,
        })}
        href={href}
      >
        {children}
      </NextLink>
    </li>
  );
};

export default Navigation;
