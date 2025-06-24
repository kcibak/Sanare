import { Provider } from '../models';

function generate8DigitId() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

export class ProviderService {
  static async createProvider(data: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }) {
    const providerid = generate8DigitId();
    return Provider.create({
      providerid,
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: data.password,
      createdat: new Date(),
    });
  }

  static async getProvider(providerid: string) {
    return Provider.findByPk(providerid);
  }

  static async updateProvider(providerid: string, data: Partial<{ firstname: string; lastname: string; email: string; }>) {
    const provider = await Provider.findByPk(providerid);
    if (!provider) return null;
    await provider.update(data);
    return provider;
  }

  static async deleteProvider(providerid: string) {
    const provider = await Provider.findByPk(providerid);
    if (!provider) return null;
    await provider.destroy();
    return true;
  }
}
