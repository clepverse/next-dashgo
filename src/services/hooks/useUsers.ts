import { useQuery } from 'react-query';
import { api } from '../api';
import moment from '../moment';

type User = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

type GetUserResponse = {
  totalCount: number;
  users: User[];
};

export async function getUsers(page: number): Promise<GetUserResponse> {
  const { data, headers } = await api.get('users', {
    params: {
      page,
    },
  });

  const totalCount = Number(headers['x-total-count']);

  const users = data.users.map((user: User) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: moment(user.created_at).format('ll'),
    };
  });

  return {
    users,
    totalCount,
  };
}

export function useUsers(page: number) {
  return useQuery(['users', page], () => getUsers(page), {
    staleTime: 1000 * 60 * 10,
  });
}
