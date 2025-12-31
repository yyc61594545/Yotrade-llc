import type {
  CheckSubscribeStatusParams,
  NewsletterProvider,
  SubscribeNewsletterParams,
  UnsubscribeNewsletterParams,
} from '@/newsletter/types';
import { Resend } from 'resend';

/**
 * Implementation of the NewsletterProvider interface using Resend
 *
 * docs:
 * https://mksaas.com/docs/newsletter
 */
export class ResendNewsletterProvider implements NewsletterProvider {
  private resend: Resend;
  private audienceId?: string;

  constructor() {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not set.');
    }
    // RESEND_AUDIENCE_ID is optional now

    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.audienceId = process.env.RESEND_AUDIENCE_ID;
  }

  /**
   * Get the provider name
   * @returns Provider name
   */
  public getProviderName(): string {
    return 'Resend';
  }

  /**
   * Get the audience ID, either from env or by fetching from Resend
   */
  private async getAudienceId(): Promise<string> {
    if (this.audienceId) {
      return this.audienceId;
    }

    try {
      const { data } = await this.resend.audiences.list();
      // Resend SDK returns { data: { data: Audience[] } } structure sometimes or just { data: Audience[] } depending on version.
      // Based on error "Property 'length' does not exist on type 'ListAudiencesResponseSuccess'", 'data' is the success object which contains the array in a property 'data'.
      if (data && data.data && data.data.length > 0) {
        this.audienceId = data.data[0].id;
        return this.audienceId;
      }
    } catch (error) {
      console.error('Failed to list audiences', error);
    }

    throw new Error(
      'No Audience ID found. Please set RESEND_AUDIENCE_ID or create an audience in Resend.'
    );
  }

  /**
   * Subscribe a user to the newsletter
   * @param email The email address to subscribe
   * @returns True if the subscription was successful, false otherwise
   */
  async subscribe({ email }: SubscribeNewsletterParams): Promise<boolean> {
    try {
      const audienceId = await this.getAudienceId();

      // Check if the contact exists
      const getResult = await this.resend.contacts.get({
        email,
        audienceId,
      });

      // If contact doesn't exist, create a new one
      if (getResult.error) {
        console.log('Creating new contact', email);
        const createResult = await this.resend.contacts.create({
          email,
          audienceId,
          unsubscribed: false,
        });

        if (createResult.error) {
          console.error('Error creating contact', createResult.error);
          return false;
        }
        console.log('Created new contact', email);
        return true;
      }

      // If the contact exists, update it
      const updateResult = await this.resend.contacts.update({
        email,
        audienceId,
        unsubscribed: false,
      });

      if (updateResult.error) {
        console.error('Error updating contact', updateResult.error);
        return false;
      }

      console.log('Subscribed newsletter', email);
      return true;
    } catch (error) {
      console.error('Error subscribing newsletter', error);
      return false;
    }
  }

  /**
   * Unsubscribe a user from the newsletter
   * @param email The email address to unsubscribe
   * @returns True if the unsubscription was successful, false otherwise
   */
  async unsubscribe({ email }: UnsubscribeNewsletterParams): Promise<boolean> {
    try {
      const audienceId = await this.getAudienceId();
      // console.log('Unsubscribing newsletter', email);
      const result = await this.resend.contacts.update({
        email,
        audienceId,
        unsubscribed: true,
      });

      // console.log('Unsubscribe result:', result);
      if (result.error) {
        console.error('Error unsubscribing newsletter', result.error);
        return false;
      }

      console.log('Unsubscribed newsletter', email);
      return true;
    } catch (error) {
      console.error('Error unsubscribing newsletter', error);
      return false;
    }
  }

  /**
   * Check if a user is subscribed to the newsletter
   * @param email The email address to check
   * @returns True if the user is subscribed, false otherwise
   */
  async checkSubscribeStatus({
    email,
  }: CheckSubscribeStatusParams): Promise<boolean> {
    try {
      const audienceId = await this.getAudienceId();

      const result = await this.resend.contacts.get({
        email,
        audienceId,
      });

      if (result.error) {
        // console.error('Error getting contact:', result.error);
        // If getting fails (e.g. 404), assume not subscribed
        return false;
      }

      const status = !result.data?.unsubscribed;
      console.log('Check subscribe status:', { email, status });
      return status;
    } catch (error) {
      console.error('Error checking subscribe status:', error);
      return false;
    }
  }
}
