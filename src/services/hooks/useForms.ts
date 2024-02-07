import { useQuery } from 'react-query';
import { api } from '../api';
import moment from '../moment';

type Form = {
  id: string;
  name: string;
  is_internal: boolean;
  qtd_questions: number;
  created_at: string;
};

type GetFormResponse = {
  totalCount: number;
  forms: Form[];
};

export async function getForms(page: number): Promise<GetFormResponse> {
  const { data, headers } = await api.get('forms', {
    params: {
      page,
    },
  });

  const totalCount = Number(headers['x-total-count']);

  const forms = data.forms.map((form: Form) => {
    return {
      id: form.id,
      name: form.name,
      is_internal: form.is_internal,
      qtd_questions: form.qtd_questions,
      created_at: moment(form.created_at).format('ll'),
    };
  });

  return {
    forms,
    totalCount,
  };
}

export function useForms(page: number) {
  return useQuery(['forms', page], () => getForms(page), {
    staleTime: 1000 * 60 * 10,
  });
}
