import { Request, Response } from 'express';
import { ProviderService } from './providerservice';

export class ProviderController {
  static async createProvider(req: Request, res: Response) {
    try {
      // Log the incoming body for debugging
      console.log('Provider create request body:', req.body);
      // Only accept camelCase
      const { firstname, lastname, email, password } = req.body;
      if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields: firstname, lastname, email, password' });
      }
      const provider = await ProviderService.createProvider({ firstname, lastname, email, password });
      if (provider) {
        res.status(201).json({ success: true });
      } else {
        res.status(500).json({ success: false, error: 'Provider creation failed' });
      }
    } catch (error: any) {
      console.error('Provider creation error:', error);
      res.status(500).json({ error: 'Failed to create provider', details: error.message || error.toString() });
    }
  }

  static async getProvider(req: Request, res: Response) {
    try {
      const { providerid } = req.params;
      const provider = await ProviderService.getProvider(providerid);
      if (!provider) {
        return res.status(404).json({ error: 'Provider not found' });
      }
      // Only return relevant fields
      const { providerid: id, firstname, lastname, email, createdat } = provider;
      res.json({ providerid: id, firstname, lastname, email, createdat });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to get provider', details: error.message || error.toString() });
    }
  }

  static async updateProvider(req: Request, res: Response) {
    try {
      const { providerid } = req.params;
      const { firstname, lastname, email } = req.body;
      if (!firstname && !lastname && !email) {
        return res.status(400).json({ error: 'At least one field (firstname, lastname, email) must be provided' });
      }
      const updated = await ProviderService.updateProvider(providerid, { firstname, lastname, email });
      if (!updated) {
        return res.status(404).json({ error: 'Provider not found' });
      }
      // Only return relevant fields
      const { providerid: id, firstname: fn, lastname: ln, email: em, createdat } = updated;
      res.json({ providerid: id, firstname: fn, lastname: ln, email: em, createdat });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to update provider', details: error.message || error.toString() });
    }
  }

  static async deleteProvider(req: Request, res: Response) {
    try {
      const { providerid } = req.params;
      const deleted = await ProviderService.deleteProvider(providerid);
      if (!deleted) {
        return res.status(404).json({ error: 'Provider not found' });
      }
      res.json({ message: 'Provider deleted' });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to delete provider', details: error.message || error.toString() });
    }
  }
}
