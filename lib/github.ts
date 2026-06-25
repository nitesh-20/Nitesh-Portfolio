const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";
const GITHUB_LOGIN = "nitesh-20";
const GITHUB_PROFILE_ENDPOINT = "https://api.github.com/users/nitesh-20";
const GITHUB_REPOS_ENDPOINT =
  "https://api.github.com/users/nitesh-20/repos?per_page=100&type=owner&sort=pushed";

const contributionQuery = `
  query ContributionCalendar($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          months {
            name
            firstDay
            totalWeeks
            year
          }
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
              color
              weekday
            }
          }
        }
      }
    }
  }
`;

export type GitHubRepository = {
  fork: boolean;
  language: string | null;
  pushed_at: string | null;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
};

export type GitHubContributionCalendar =
  | {
      available: true;
      totalContributions: number;
      weeks: Array<{
        contributionDays: Array<{
          date: string;
          contributionCount: number;
          contributionLevel: string;
          color: string;
          weekday: number;
        }>;
      }>;
      months: Array<{
        name: string;
        firstDay: string;
        totalWeeks: number;
        year: number;
      }>;
    }
  | {
      available: false;
      reason: string;
      message?: string;
    };

export function buildHeaders(token?: string) {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "nitesh-20-portfolio",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export function summarizeRepositories(repositories: GitHubRepository[]) {
  const ownedRepositories = repositories.filter((repo) => !repo.fork);
  const latestPush = ownedRepositories[0]?.pushed_at || repositories[0]?.pushed_at || null;
  const languageCounts = ownedRepositories.reduce<Record<string, number>>((counts, repo) => {
    if (repo.language) {
      counts[repo.language] = (counts[repo.language] || 0) + 1;
    }
    return counts;
  }, {});

  const topLanguage =
    Object.entries(languageCounts).sort((left, right) => right[1] - left[1])[0]?.[0] || null;

  return {
    latestPush,
    topLanguage,
    recentRepositories: ownedRepositories.slice(0, 4).map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      pushedAt: repo.pushed_at,
    })),
  };
}

export async function fetchContributionCalendarFallback(username: string): Promise<GitHubContributionCalendar> {
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) {
      throw new Error(`Fallback API failed with status ${res.status}`);
    }
    const data = await res.json();
    if (!data.contributions || !Array.isArray(data.contributions)) {
      throw new Error("Invalid fallback contribution data");
    }

    const contribMap = new Map<string, { count: number; level: number }>();
    for (const c of data.contributions) {
      contribMap.set(c.date, c);
    }

    const today = new Date();
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
    
    const startOfWeek = new Date(endOfWeek);
    startOfWeek.setDate(endOfWeek.getDate() - 370);

    const weeks: any[] = [];
    let currentWeek: any[] = [];
    const dateIter = new Date(startOfWeek);

    while (dateIter <= endOfWeek) {
      const dateStr = dateIter.toISOString().split("T")[0];
      const contrib = contribMap.get(dateStr) || { count: 0, level: 0 };
      
      const levelMap: Record<number, string> = {
        0: "NONE",
        1: "FIRST_QUARTILE",
        2: "SECOND_QUARTILE",
        3: "THIRD_QUARTILE",
        4: "FOURTH_QUARTILE",
      };
      
      const colorMap: Record<number, string> = {
        0: "#161b22",
        1: "#0e4429",
        2: "#006d32",
        3: "#26a641",
        4: "#39d353",
      };

      currentWeek.push({
        date: dateStr,
        contributionCount: contrib.count,
        contributionLevel: levelMap[contrib.level] || "NONE",
        color: colorMap[contrib.level] || "#161b22",
        weekday: dateIter.getDay(),
      });

      if (currentWeek.length === 7) {
        weeks.push({ contributionDays: currentWeek });
        currentWeek = [];
      }

      dateIter.setDate(dateIter.getDate() + 1);
    }

    const months: any[] = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let prevMonthName = "";
    let weekCount = 0;

    for (let i = 0; i < weeks.length; i++) {
      const firstDayOfWeek = new Date(weeks[i].contributionDays[0].date);
      const mName = monthNames[firstDayOfWeek.getMonth()];
      const yNum = firstDayOfWeek.getFullYear();

      if (mName !== prevMonthName) {
        if (months.length > 0) {
          months[months.length - 1].totalWeeks = weekCount;
        }
        months.push({
          name: mName,
          firstDay: weeks[i].contributionDays[0].date,
          totalWeeks: 0,
          year: yNum,
        });
        prevMonthName = mName;
        weekCount = 0;
      }
      weekCount++;
    }
    if (months.length > 0) {
      months[months.length - 1].totalWeeks = weekCount;
    }

    let totalContributions = 0;
    for (const week of weeks) {
      for (const day of week.contributionDays) {
        totalContributions += day.contributionCount;
      }
    }

    return {
      available: true,
      totalContributions,
      weeks,
      months,
    };
  } catch (error) {
    return {
      available: false,
      reason: "fallback_failed",
      message: error instanceof Error ? error.message : "Unknown fallback error",
    };
  }
}

export async function fetchContributionCalendar(token?: string): Promise<GitHubContributionCalendar> {
  if (!token) {
    return fetchContributionCalendarFallback(GITHUB_LOGIN);
  }

  try {
    const to = new Date();
    const from = new Date(to);
    from.setFullYear(to.getFullYear() - 1);

    const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        ...buildHeaders(token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: contributionQuery,
        variables: {
          login: GITHUB_LOGIN,
          from: from.toISOString(),
          to: to.toISOString(),
        },
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`GitHub GraphQL failed with ${response.status}`);
    }

    const payload = await response.json();
    const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar;

    if (payload.errors?.length || !calendar) {
      throw new Error("GitHub GraphQL returned an invalid contribution payload");
    }

    return {
      available: true,
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks,
      months: calendar.months,
    };
  } catch (error) {
    console.warn("GitHub GraphQL failed, falling back to public API:", error);
    return fetchContributionCalendarFallback(GITHUB_LOGIN);
  }
}

export async function fetchGitHubSnapshot() {
  const token = process.env.GITHUB_TOKEN;
  const headers = buildHeaders(token);

  const [profileResponse, reposResponse, contributionCalendar] = await Promise.all([
    fetch(GITHUB_PROFILE_ENDPOINT, {
      headers,
      next: { revalidate: 900 },
    }),
    fetch(GITHUB_REPOS_ENDPOINT, {
      headers,
      next: { revalidate: 900 },
    }),
    fetchContributionCalendar(token).catch((error) => ({
      available: false,
      reason: "github_unavailable",
      message: error instanceof Error ? error.message : "Unknown GitHub error",
    })),
  ]);

  if (!profileResponse.ok || !reposResponse.ok) {
    throw new Error("GitHub public profile sync failed");
  }

  const [profile, repositories] = await Promise.all([profileResponse.json(), reposResponse.json()]);
  const summary = summarizeRepositories(repositories);

  return {
    profile: {
      login: profile.login || GITHUB_LOGIN,
      url: profile.html_url || `https://github.com/${GITHUB_LOGIN}`,
      publicRepos: profile.public_repos ?? summary.recentRepositories.length,
      followers: profile.followers ?? 0,
    },
    summary: {
      topLanguage: summary.topLanguage,
      lastPush: summary.latestPush,
    },
    repositories: summary.recentRepositories,
    contributionCalendar,
    generatedAt: new Date().toISOString(),
  };
}
