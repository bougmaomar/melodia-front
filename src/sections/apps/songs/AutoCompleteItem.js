
const AutoCompleteItem = (composers, composersIds, ) => {
    return (
        <>
            {/* <Autocomplete
                      multiple
                      id="demo-multiple-chip-composers"
                      options={composers}
                      value={composersIds.map((id) => composers.find((c) => c.id === id))}
                      onChange={(e, newValue) => {
                        newValue.forEach((option) => {
                          if (option && option.name && !option.id) {
                            const newComposer = { name: option.name };
                            addComposer(newComposer).then((res) => {
                              if (res.id) {
                                getComposers().then((updatedComposers) => {
                                  setComposers(updatedComposers);
                                });
                                const updatedComposerIds = [...formData.ComposerIds, res.id];
                                handleInputChange({ target: { value: updatedComposerIds } }, 'ComposerIds');
                              } else {
                                console.error('Failed to add composer:', res.error);
                              }
                            });
                          }
                        });
                        handleInputChange({ target: { value: newValue.map((option) => option.id) } }, 'ComposerIds');
                      }}
                      filterOptions={(options, params) => {
                        const filtered = options.filter((option) => {
                          return option.name.toLowerCase().includes(params.inputValue.toLowerCase());
                        });

                        if (
                          params.inputValue !== '' &&
                          !filtered.some((option) => option.name.toLowerCase() === params.inputValue.toLowerCase())
                        ) {
                          filtered.push({ name: params.inputValue });
                        }

                        return filtered;
                      }}
                      renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Composers" />}
                      getOptionLabel={(option) => (option && option.name ? option.name : '')}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                          if (option && typeof option === 'object' && 'name' in option) {
                            return <Chip key={option.id} label={option.name} {...getTagProps({ index })} />;
                          } else {
                            return <Chip key={option} label={option} {...getTagProps({ index })} />;
                          }
                        })
                      }
                    /> */}
        </>
    );
}