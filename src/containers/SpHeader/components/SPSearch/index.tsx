import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useRouter} from "next/navigation";
import React from "react";
import {useForm} from "react-hook-form";

type SearchForm = {
  query: string;
};
const SPSearch = () => {
  const router = useRouter();
  const {register, handleSubmit} = useForm<SearchForm>({
    defaultValues: {
      query: "",
    },
  });

  const onSubmit = (data: SearchForm) => {
    const trimmed = data.query.trim();
    if (trimmed) {
      // Avoid pre-encoding to prevent double-encoding
      router.push(`/job/search?titleSearch=${trimmed}`);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center gap-x-4 w-full md:w-auto"
    >
      <div className="flex text-black h-[40px] w-full md:w-[250px] relative transition-all duration-300 mx-3 my-3">
        <input
          type="text"
          placeholder="Find freelancers..."
          {...register("query")}
          className="focus:outline-none rounded-[20px] border-2-white px-5 text-sm font-mono w-full"
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

export default SPSearch;
