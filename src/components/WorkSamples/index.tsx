'use client';

import {useMyUser} from '@/hooks/profile-api/useMyUser';
import {useWorkSamplesForm} from '@/app/[lang]/(profile)/account-setting/hooks/useWorkSamplesForm';
import {CustomInput} from '@/components/ui/InputField';
import {useTranslation} from 'react-i18next';
import {ChevronLeft, ChevronRight, Edit, Plus, Trash} from 'lucide-react';
import {useState} from 'react';

export default function WorkSamples() {
    const {t} = useTranslation();
    const {person} = useMyUser();
    const {
        form,
        errors,
        editingSampleId,
        addSample,
        editSample,
        deleteSample,
        startEditing,
        cancelEditing,
        validateField,
    } = useWorkSamplesForm(person ?? undefined);
    const [currentSampleIndex, setCurrentSampleIndex] = useState(0);
    const samplesPerPage = 2;

    const handleNextSample = () => {
        setCurrentSampleIndex((prev) =>
            prev + samplesPerPage < form.workSamples.length ? prev + samplesPerPage : prev
        );
    };

    const handlePrevSample = () => {
        setCurrentSampleIndex((prev) => (prev - samplesPerPage >= 0 ? prev - samplesPerPage : 0));
    };

    const handleAddOrUpdateSample = async () => {
        if (editingSampleId) {
            await editSample(editingSampleId);
        } else {
            await addSample();
        }
    };

    return (
        <div className="border border-border-primary rounded-lg bg-white py-6 mb-8">
            <div className="border-b border-border-primary px-6">
                <h2 className="text-sm sm:text-lg font-semibold text-gray-700 mb-2">
                    {t('profileInfo.sectionWorkSamples')}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                    {t('profileInfo.subtitleWorkSamples')}
                </p>
            </div>

            <div className="px-6">
                <div className="mb-6 space-y-4 sm:space-y-5">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        {editingSampleId ? t('profileInfo.editWorkSample') : t('profileInfo.addWorkSample')}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <CustomInput
                            tag="input"
                            type="text"
                            name="title"
                            label={t('profileInfo.sampleTitle')}
                            placeholder={t('profileInfo.sampleTitle') || 'Enter title'}
                            value={form.newSample.title}
                            onChange={(e) => {
                                form.newSample.title = e.target.value;
                                validateField('title', e.target.value);
                            }}
                            error={errors.title}
                            required
                            aria-describedby={errors.title ? 'title-error' : undefined}
                        />
                        <CustomInput
                            tag="input"
                            type="text"
                            name="sampleUrl"
                            label={t('profileInfo.sampleUrl')}
                            placeholder={t('profileInfo.sampleUrl') || 'Enter URL'}
                            value={form.newSample.sampleUrl}
                            onChange={(e) => {
                                form.newSample.sampleUrl = e.target.value;
                                validateField('sampleUrl', e.target.value);
                            }}
                            error={errors.sampleUrl}
                            required
                            aria-describedby={errors.sampleUrl ? 'sampleUrl-error' : undefined}
                        />
                    </div>
                    <CustomInput
                        tag="textarea"
                        type="textarea"
                        name="description"
                        label={t('profileInfo.sampleDescription')}
                        placeholder={t('profileInfo.sampleDescription') || 'Enter description'}
                        value={form.newSample.description}
                        onChange={(e) => {
                            form.newSample.description = e.target.value;
                            validateField('description', e.target.value);
                        }}
                        error={errors.description}
                        required
                        rows={4}
                        aria-describedby={errors.description ? 'description-error' : undefined}
                    />
                    <div className="flex gap-2 sm:gap-3">
                        <button
                            type="button"
                            onClick={handleAddOrUpdateSample}
                            className="px-3 sm:px-4 py-1 sm:py-2 bg-primary text-white rounded-md hover:bg-[#063a68] transition-colors duration-200 flex items-center text-xs sm:text-sm"
                        >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2"/>
                            {editingSampleId ? t('profileInfo.updateWorkSample') : t('profileInfo.addWorkSample')}
                        </button>
                        {editingSampleId && (
                            <button
                                type="button"
                                onClick={cancelEditing}
                                className="px-3 sm:px-4 py-1 sm:py-2 text-gray-600 hover:text-gray-800 rounded-md border border-gray-300 text-xs sm:text-sm"
                            >
                                {t('profileInfo.cancel')}
                            </button>
                        )}
                    </div>
                </div>
                <div className="relative">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {form.workSamples
                            .slice(currentSampleIndex, currentSampleIndex + samplesPerPage)
                            .map((sample) => (
                                <div
                                    key={sample.id}
                                    className="p-4 rounded-lg border border-gray-200 transition-transform duration-300 hover:scale-105"
                                >
                                    <h4 className="font-medium text-gray-800 text-xs sm:text-sm">{sample.title}</h4>
                                    <p className="text-gray-600 text-xs mt-1">{sample.description}</p>
                                    <a
                                        href={sample.sampleUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary text-xs hover:underline"
                                    >
                                        {t('profileInfo.viewWorkSample')}
                                    </a>
                                    <div className="flex justify-start gap-2 mt-2">
                                        <button
                                            type="button"
                                            onClick={() => startEditing(sample)}
                                            className="p-1 text-primary hover:text-blue-800"
                                            aria-label={t('profileInfo.editWorkSample')}
                                        >
                                            <Edit className="w-4 h-4 sm:w-5 sm:h-5"/>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => deleteSample(sample.id)}
                                            className="p-1 text-red-600 hover:text-red-800"
                                            aria-label={t('profileInfo.deleteWorkSample')}
                                        >
                                            <Trash className="w-4 h-4 sm:w-5 sm:h-5"/>
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                    {form.workSamples.length > samplesPerPage && (
                        <>
                            <button
                                type="button"
                                onClick={handlePrevSample}
                                disabled={currentSampleIndex === 0}
                                className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-primary text-white backdrop-blur-sm transition-all duration-200 text-xs sm:text-sm ${
                                    currentSampleIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:backdrop-blur-none hover:bg-[#063a68]'
                                }`}
                                aria-label={t('profileInfo.previousSamples')}
                            >
                                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6"/>
                            </button>
                            <button
                                type="button"
                                onClick={handleNextSample}
                                disabled={currentSampleIndex + samplesPerPage >= form.workSamples.length}
                                className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-primary text-white backdrop-blur-sm transition-all duration-200 text-xs sm:text-sm ${
                                    currentSampleIndex + samplesPerPage >= form.workSamples.length
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:backdrop-blur-none hover:bg-[#063a68]'
                                }`}
                                aria-label={t('profileInfo.nextSamples')}
                            >
                                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6"/>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}