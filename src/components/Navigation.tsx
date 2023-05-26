import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import { ROUTES, QUERY_PARAMS } from '@/lib/routes';
import useGetAuth from '@/lib/useGetAuth';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
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
import React, { useEffect, useState } from 'react';
import {
  useAuthState,
  useIdToken,
  useSignOut,
} from 'react-firebase-hooks/auth';
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
        href: ROUTES.MATCHES_CREATE,
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
        label: 'Stwórz nowy obiekt',
        desc: 'Zaproś znajomych i rozegrajcie mecz',
        href: ROUTES.FACILITIES_CREATE,
      },
      {
        label: 'Przeglądaj obiekty',
        desc: 'Przeglądaj mecze i dołącz do nich',
        href: ROUTES.FACILITIES,
      },
    ],
  },
  tournaments: {
    title: 'Turnieje',
    links: [
      {
        label: 'Stwórz nowy turniej',
        desc: 'Zaproś znajomych i rozegrajcie mecz',
        href: ROUTES.TOURNAMENTS_CREATE,
      },
      {
        label: 'Przeglądaj turnieje',
        desc: 'Przeglądaj mecze i dołącz do nich',
        href: ROUTES.TOURNAMENTS,
      },
    ],
  },
  teams: {
    title: 'Drużyny',
    links: [
      {
        label: 'Stwórz nową drużynę',
        desc: 'Rozgrywaj mecze ze swoimi ulubionymi ludźmi i stówrz drużynę marzeń',
        href: ROUTES.TEAMS_CREATE,
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
  );
}

/**
 * Hamburger menu component. It is used in mobile view.
 */
const HamburgerMenu = () => {
  const router = useRouter();
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const [expandedContent, setExpandedContent] = useState<string | null>(null);
  const auth = useGetAuth();
  const [user] = useIdToken(auth);

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
                  className="flex cursor-pointer justify-between border-b border-b-gray-500 p-4"
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
                className="mb-3 flex items-center justify-center gap-2"
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
  const [user, authLoading, authError] = useAuthState(auth);
  const [signOut, _, errorSignOut] = useSignOut(auth);

  useEffect(() => {
    if (authError) {
      toast.error(`Wystąpił błąd: ${authError.message}`);
    }
    if (errorSignOut) {
      toast.error(`Wystąpił błąd: ${errorSignOut.message}`);
    }
  }, [authError, errorSignOut]);

  const signOutHandler = async () => {
    await signOut();
    await router.push(ROUTES.HOME);
    toast.success('Wylogowano pomyślnie');
  };

  return (
    <div className="flex justify-end lg:w-[250px]">
      {!authLoading && !user && (
        <ul className="flex items-center gap-6 text-green-900 ">
          <Link
            href={{
              pathname: ROUTES.LOGIN,
              query: {
                [QUERY_PARAMS.REDIRECT]: router.pathname,
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
                  [QUERY_PARAMS.REDIRECT]: router.pathname,
                },
              }}
            >
              <Button value="Rejestracja" type="primary" />
            </NextLink>
          </li>
        </ul>
      )}
      {!authLoading && user && (
        <div className="flex items-center gap-2">
          <NextLink href={`${ROUTES.PROFILE}/${user.uid}`}>
            <Avatar firstName="Jan" lastName="Kowalski" clickable />
          </NextLink>
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

  return (
    <div className="hidden cursor-pointer lg:block">
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
