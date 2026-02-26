import { Component, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

interface Country {
    flag: string;
    code: string;
    name: string;
}

const COUNTRIES: Country[] = [
    { flag: '🇮🇳', code: '+91', name: 'India' },
    { flag: '🇺🇸', code: '+1', name: 'USA' },
    { flag: '🇬🇧', code: '+44', name: 'UK' },
    { flag: '🇦🇺', code: '+61', name: 'Australia' },
    { flag: '🇩🇪', code: '+49', name: 'Germany' },
    { flag: '🇫🇷', code: '+33', name: 'France' },
    { flag: '🇯🇵', code: '+81', name: 'Japan' },
    { flag: '🇨🇳', code: '+86', name: 'China' },
    { flag: '🇧🇷', code: '+55', name: 'Brazil' },
    { flag: '🇿🇦', code: '+27', name: 'South Africa' },
    { flag: '🇦🇪', code: '+971', name: 'UAE' },
    { flag: '🇸🇬', code: '+65', name: 'Singapore' },
];

@Component({
    selector: 'app-country-code-picker',
    standalone: true,
    template: `
        <div class="dropdown">
            <button
                type="button"
                class="btn btn-outline-secondary dropdown-toggle px-3"
                [class.disabled]="disabled()"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-label="Select country code"
            >
                {{ selected().flag }}
            </button>
            <ul class="dropdown-menu dropdown-menu-start py-1" style="min-width:180px">
                @for (country of countries; track country.code) {
                <li>
                    <button
                        type="button"
                        class="dropdown-item d-flex align-items-center"
                        [class.active]="country.code === selected().code"
                        (click)="select(country)"
                    >
                        <span class="flag me-2">{{ country.flag }}</span>
                        <span class="code text-body-secondary small me-2">{{ country.code }}</span>
                        <span class="name small">{{ country.name }}</span>
                    </button>
                </li>
                }
            </ul>
        </div>
    `,
    styles: [`
        :host { display: flex; }
        .dropdown { display: flex; }
        .btn {
            border-radius: 8px 0 0 8px;
            font-size: 18px;
            line-height: 1.5;
            border-right: 0;
            height: 100%;
            display: flex;
            align-items: center;
            padding-top: 0;
            padding-bottom: 0;
            background: var(--bg-secondary, #f8f9fa);
            border-color: var(--border, #dee2e6);
            z-index: 0 !important;
        }
        .btn:hover, .btn:focus {
            background: var(--bg-tertiary, #e9ecef);
            border-color: var(--border, #dee2e6);
        }
        .dropdown-menu {
            border-color: var(--border, #dee2e6);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .dropdown-item {
            padding: 8px 12px;
        }
        .dropdown-item .flag { font-size: 18px; }
        .dropdown-item .code { min-width: 48px; }
        .dropdown-item.active { background: var(--bs-primary); color: #fff; }
        .dropdown-item.active .text-body-secondary { color: rgba(255,255,255,.7) !important; }
        .dropdown-item:hover:not(.active) { background: var(--bg-secondary, #f8f9fa); }
    `],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CountryCodePickerComponent),
            multi: true,
        },
    ],
})
export class CountryCodePickerComponent implements ControlValueAccessor {
    readonly countries = COUNTRIES;
    readonly selected = signal<Country>(COUNTRIES[0]);
    readonly disabled = signal(false);

    private onChange: (value: string) => void = () => {};
    onTouched: () => void = () => {};

    select(country: Country): void {
        this.selected.set(country);
        this.onChange(country.code);
        this.onTouched();
    }

    writeValue(value: string): void {
        const match = COUNTRIES.find(c => c.code === value);
        if (match) this.selected.set(match);
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled.set(isDisabled);
    }
}
