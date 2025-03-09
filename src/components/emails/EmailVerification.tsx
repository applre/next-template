import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Button,
  Tailwind,
  Hr,
} from '@react-email/components';
import { APP_TITLE } from '@/lib/constants';

export interface EmailVerificationTemplateProps {
  host: string;
  url: string;
  locale?: string;
  translations: {
    preview: string;
    greeting: string;
    message: string;
    button: string;
    ignore: string;
    expiry: string;
  };
}

export const EmailVerificationTemplate = ({
  host,
  url,
  translations,
}: EmailVerificationTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>{translations.preview.replace('{appTitle}', APP_TITLE)}</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-5 pb-12">
            <Text className="text-base">{APP_TITLE}</Text>
            <Text className="text-base">{translations.greeting}</Text>
            <Text className="text-base">{translations.message.replace('{host}', host)}</Text>
            <Section className="my-5 text-center">
              <Button
                className="inline-block rounded-md bg-zinc-900 px-4 py-2 text-base text-white no-underline"
                href={url}
              >
                {translations.button}
              </Button>

              <Text className="text-base">{translations.ignore}</Text>
              <Hr className="my-4 border-gray-300 border-t-2" />
              <Text className="text-gray-600 text-sm">{translations.expiry}</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
