import { faker } from '@faker-js/faker';
import {
  ActiveModelSerializer,
  createServer,
  Factory,
  Model,
  Response,
} from 'miragejs';

import { v4 as uuid } from 'uuid';

type User = {
  name: string;
  email: string;
  created_at: string;
};

type Form = {
  name: string;
  is_internal: boolean;
  qtd_questions: number;
  created_at: string;
};

export function makeServer() {
  const server = createServer({
    serializers: {
      application: ActiveModelSerializer,
    },

    models: {
      user: Model.extend<Partial<User>>({}),
      form: Model.extend<Partial<Form>>({}),
    },

    factories: {
      user: Factory.extend({
        name(i: number) {
          return `User ${i + 1}`;
        },
        email() {
          return faker.internet.email().toLowerCase();
        },
        created_at() {
          return faker.date.recent(10);
        },
      }),
      form: Factory.extend({
        name: (i: number) => `Formulário ${i + 1}`,
        is_internal() {
          return true;
        },
        qtd_questions() {
          return faker.random.numeric()
        },
        created_at() {
          return faker.date.recent(10);
        },
      }),
    },

    seeds(server) {
      server.createList('user', 200);
      server.createList('form', 8);
    },

    routes() {
      this.namespace = 'api';
      this.timing = 750;

      this.get('/users', function (schema, request) {
        const { page = 1, per_page = 10 } = request.queryParams;

        const total = schema.all('user').length;

        const pageStart = (Number(page) - 1) * Number(per_page);
        const pageEnd = pageStart + Number(per_page);

        const users = this.serialize(schema.all('user')).users.slice(
          pageStart,
          pageEnd,
        );

        return new Response(200, { 'x-total-count': String(total) }, { users });
      });

      this.get('/users/:id');
      this.post('/users');

      this.get('/forms', function (schema, request) {
        const { page = 1, per_page = 10 } = request.queryParams;

        const total = schema.all('form').length;

        const pageStart = (Number(page) - 1) * Number(per_page);
        const pageEnd = pageStart + Number(per_page);

        const forms = this.serialize(schema.all('form')).forms.slice(
          pageStart,
          pageEnd,
        );

        return new Response(200, { 'x-total-count': String(total) }, { forms });
      });

      this.get('/forms/:id');
      this.post('/forms')

      this.namespace = '';
      this.passthrough();
    },
  });

  return server;
};
