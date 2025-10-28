import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";


type SearchForm = {
  query: string;
};

const SearchInput = () => {
  const router = useRouter();
  const {t} = useTranslation();
  const {register, handleSubmit} = useForm<SearchForm>({
    defaultValues: {
      query: "",
    },
  });

  const onSubmit = (data: SearchForm) => {
    const trimmed = data.query.trim();
    if (trimmed) {
      // Avoid pre-encoding, Next.js will encode the URL automatically
      router.push(`/job-board?q=${trimmed}`);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-[1.5rem] flex justify-center"
    >
      <div className="flex text-black h-[40px] relative w-[624px]">
        <input
          type="text"
          placeholder={t("global.hintTextHeaderSearch")}
          className="focus:outline-none rounded-[20px] border-2-white px-5 text-sm font-mono w-full"
          {...register("query")}
        />
        <button type="submit" aria-label="Search">
          <FontAwesomeIcon
            icon={faSearch}
            className="w-[14px] h-[14px] text-primary absolute right-3 top-1/2 -translate-y-1/2"
          />
        </button>
      </div>
    </form>
  );
};

export default SearchInput;
