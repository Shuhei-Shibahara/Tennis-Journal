import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import Input from './Input';
import { COURT_SURFACES, TENNIS_SKILLS } from '../../constants';

interface JournalFormFieldsProps {
  register: UseFormRegister<any>;
  errors: any;
  mode?: 'create' | 'edit';
}

const JournalFormFields: React.FC<JournalFormFieldsProps> = ({
  register,
  errors,
  mode = 'create'
}) => {
  return (
    <>
      <Input
        label="Date"
        name="date"
        type="date"
        register={register}
        error={errors.date?.message}
      />

      <Input
        label="Tournament Name"
        name="tournamentName"
        register={register}
        error={errors.tournamentName?.message}
      />

      <Input
        label="Opponent"
        name="opponent"
        register={register}
        error={errors.opponent?.message}
      />

      <div className="space-y-2">
        <label className="block font-medium">Result</label>
        {['Win', 'Lose'].map((result) => (
          <label key={result} className="flex items-center space-x-2">
            <input
              type="radio"
              value={result}
              {...register('result')}
              className="form-radio"
            />
            <span>{result}</span>
          </label>
        ))}
      </div>

      <Input
        label="Score"
        name="score"
        register={register}
        error={errors.score?.message}
        placeholder="e.g., 6-4, 7-5"
      />

      <div className="space-y-2">
        <label className="block font-medium">Court Surface</label>
        {COURT_SURFACES.map((surface) => (
          <label key={surface} className="flex items-center space-x-2">
            <input
              type="radio"
              value={surface}
              {...register('courtSurface', { required: true })}
              className="form-radio"
            />
            <span>{surface}</span>
          </label>
        ))}
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Strengths</label>
        {TENNIS_SKILLS.map((skill) => (
          <label key={skill} className="flex items-center space-x-2">
            <input
              type="checkbox"
              value={skill}
              {...register('strengths')}
              className="form-checkbox"
            />
            <span>{skill}</span>
          </label>
        ))}
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Weaknesses</label>
        {TENNIS_SKILLS.map((skill) => (
          <label key={skill} className="flex items-center space-x-2">
            <input
              type="checkbox"
              value={skill}
              {...register('weaknesses')}
              className="form-checkbox"
            />
            <span>{skill}</span>
          </label>
        ))}
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Lessons Learned</label>
        <textarea
          {...register('lessonsLearned', { required: true })}
          className="w-full p-3 border rounded-lg"
          placeholder="Share your experience"
        />
        {errors.lessonsLearned && (
          <p className="text-red-500 text-sm">Lessons Learned is required</p>
        )}
      </div>
    </>
  );
};

export default JournalFormFields; 