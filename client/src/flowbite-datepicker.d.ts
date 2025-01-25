declare module 'flowbite-datepicker' {
    export interface DatepickerOptions {
      /**
       * The date format, combination of d, dd, D, DD, m, mm, M, MM, yy, yyyy
       */
      format?: string;
      /**
       * Whether to hide the datepicker automatically when a date is selected
       */
      autohide?: boolean;
      /**
       * Whether to highlight today's date
       */
      todayHighlight?: boolean;
      /**
       * Whether to show the clear button
       */
      clearBtn?: boolean;
    }
  
    export class Datepicker {
      constructor(element: HTMLElement, options?: DatepickerOptions);
      
      /**
       * Gets the selected date
       */
      getDate(): Date;
  
      /**
       * Sets the selected date
       */
      setDate(date: Date): void;
  
      /**
       * Updates the datepicker's options
       */
      setOptions(options: Partial<DatepickerOptions>): void;
  
      /**
       * Destroys the datepicker instance
       */
      destroy(): void;
    }
  }